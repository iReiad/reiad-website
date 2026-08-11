// read-aloud.js — attach to article pages and provide a Read aloud control.
// Put this file in aab/ so it's served at "/read-aloud.js". It is defensive:
// if the browser doesn't support speechSynthesis it simply does nothing.

(function () {
  if (!("speechSynthesis" in window)) return;
  const article = document.querySelector('article.wrap.article[data-slug]') ||
                  document.querySelector('article[data-slug]');
  if (!article) return;

  // UI
  const toolbar = document.createElement("div");
  toolbar.className = "read-aloud-toolbar";
  toolbar.style.cssText = "margin:12px 0;display:flex;gap:8px;align-items:center;flex-wrap:wrap";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "read-aloud-btn";
  btn.textContent = "🔈 Read aloud";
  btn.style.cssText = "padding:6px 10px;border-radius:6px;cursor:pointer";

  const rateLabel = document.createElement("label");
  rateLabel.style.cssText = "font-size:0.9rem;color:var(--muted-color,#666);display:flex;gap:6px;align-items:center";
  rateLabel.textContent = "Speed";
  const rateInput = document.createElement("input");
  rateInput.type = "range";
  rateInput.min = "0.7";
  rateInput.max = "1.4";
  rateInput.step = "0.1";
  rateInput.value = "1.0";
  rateInput.title = "Speech rate";
  rateLabel.appendChild(rateInput);

  toolbar.appendChild(btn);
  toolbar.appendChild(rateLabel);

  const byline = article.querySelector(".byline");
  (byline || article).insertAdjacentElement("afterend", toolbar);

  const style = document.createElement("style");
  style.textContent = `
  .read-aloud-highlight { outline: 3px solid rgba(255,210,100,0.18); background: rgba(255,210,100,0.04); transition: background .12s; }
  .read-aloud-toolbar { user-select: none; }
  `;
  document.head.appendChild(style);

  const synth = window.speechSynthesis;
  let voices = [];
  function loadVoices() {
    voices = synth.getVoices() || [];
  }
  loadVoices();
  if (typeof speechSynthesis !== "undefined") {
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  function detectLang(text) {
    if (/[ঀ-৾]/.test(text)) return "bn-BD";
    return "en-GB";
  }

  function pickVoice(lang) {
    const short = lang.split("-")[0];
    let v = voices.find((x) => x.lang === lang);
    if (!v) v = voices.find((x) => x.lang && x.lang.startsWith(short));
    if (!v && short !== "en") v = voices.find((x) => x.lang && x.lang.startsWith("en"));
    return v || null;
  }

  function buildSegments(root) {
    const nodes = root.querySelectorAll("h1,h2,h3,h4,p,li");
    const segs = [];
    nodes.forEach((n) => {
      if (n.closest(".prev-next, .note, .byline, .react-row, .qa-list")) return;
      const t = n.innerText.trim();
      if (!t) return;
      if (t.length < 2) return;
      segs.push({ node: n, text: t });
    });
    return segs;
  }

  function clearHighlights() {
    article.querySelectorAll(".read-aloud-highlight").forEach((el) => el.classList.remove("read-aloud-highlight"));
  }

  btn.addEventListener("click", async () => {
    if (synth.speaking) {
      synth.cancel();
      btn.textContent = "🔈 Read aloud";
      clearHighlights();
      return;
    }

    const text = article.innerText || "";
    const lang = detectLang(text);
    const voice = pickVoice(lang);
    const rate = parseFloat(rateInput.value) || 1.0;
    const segments = buildSegments(article);

    if (!segments.length) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      if (voice) u.voice = voice;
      u.rate = rate;
      u.onend = () => { btn.textContent = "🔈 Read aloud"; clearHighlights(); };
      synth.speak(u);
      btn.textContent = "⏹ Stop";
      return;
    }

    btn.textContent = "⏹ Stop";

    for (let i = 0; i < segments.length; i++) {
      if (!synth) break;
      const s = segments[i];
      if (!s.text) continue;

      const u = new SpeechSynthesisUtterance(s.text);
      u.lang = lang;
      if (voice) u.voice = voice;
      u.rate = rate;

      await new Promise((res) => {
        u.onstart = () => {
          clearHighlights();
          s.node.classList.add("read-aloud-highlight");
          s.node.scrollIntoView({ behavior: "smooth", block: "center" });
        };
        u.onend = () => {
          s.node.classList.remove("read-aloud-highlight");
          res();
        };
        u.onerror = () => { s.node.classList.remove("read-aloud-highlight"); res(); };
        synth.speak(u);
      });

      // If user cancelled, stop processing
      if (!synth.speaking && synth.pending === false) {
        if (window.canceledByUser) break;
      }
    }

    btn.textContent = "🔈 Read aloud";
    clearHighlights();
  });

  window.addEventListener("pagehide", () => synth.cancel());
  document.addEventListener("visibilitychange", () => { if (document.hidden) synth.cancel(); });
})();
