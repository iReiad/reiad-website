/* ============================================================
   app.js — sitewide behavior for reiad.co.uk
   (1) dark mode toggle, (2) kinetic hero headline,
   (3) Ctrl/Cmd+K command palette.
   URLs in SITE_INDEX are root-absolute (start with /) so the
   palette works from any page, including /learn/terms/ pages.
   NOTE: root-absolute paths need a web server — use
   `python3 -m http.server` for local preview, not file://
   ============================================================ */

const SITE_INDEX = [
  { title: "Home",                        url: "/index.html",      hint: "Page" },
  { title: "Learn hub — শেখার লাইব্রেরি",   url: "/learn/index.html", hint: "Page" },
  { title: "Insights",                    url: "/insights.html",   hint: "Page" },
  { title: "Portfolio & services",        url: "/portfolio.html",  hint: "Page" },
  { title: "About Rony",                  url: "/about.html",      hint: "Page" },
  { title: "Contact / register interest", url: "/contact.html",    hint: "Page" },
  { title: "How the Dhaka Stock Exchange actually works", url: "/insights/dse-basics.html", hint: "Article" },
  // ---- Learn hub terms ----
  { title: "শেয়ার (Share / Stock)",            url: "/learn/terms/share.html",           hint: "Learn" },
  { title: "ঢাকা স্টক এক্সচেঞ্জ (DSE)",          url: "/learn/terms/dse.html",             hint: "Learn" },
  { title: "সূচক (Index / DSEX)",              url: "/learn/terms/dsex.html",            hint: "Learn" },
  { title: "বিও অ্যাকাউন্ট (BO Account)",        url: "/learn/terms/bo-account.html",      hint: "Learn" },
  { title: "ব্রোকার (Broker)",                  url: "/learn/terms/broker.html",          hint: "Learn" },
  { title: "আইপিও (IPO)",                      url: "/learn/terms/ipo.html",             hint: "Learn" },
  { title: "মিউচুয়াল ফান্ড (Mutual Fund)",       url: "/learn/terms/mutual-fund.html",     hint: "Learn" },
  { title: "সঞ্চয়পত্র (Savings Certificate)",    url: "/learn/terms/sanchayapatra.html",   hint: "Learn" },
  { title: "বন্ড (Bond)",                       url: "/learn/terms/bond.html",            hint: "Learn" },
  { title: "এফডিআর (Fixed Deposit / FDR)",      url: "/learn/terms/fdr.html",             hint: "Learn" },
  { title: "ডিভিডেন্ড (Dividend)",              url: "/learn/terms/dividend.html",        hint: "Learn" },
  { title: "ইপিএস (EPS)",                      url: "/learn/terms/eps.html",             hint: "Learn" },
  { title: "পিই রেশিও (P/E Ratio)",             url: "/learn/terms/pe-ratio.html",        hint: "Learn" },
  { title: "এনএভি (NAV)",                      url: "/learn/terms/nav.html",             hint: "Learn" },
  { title: "ঝুঁকি ও রিটার্ন (Risk & Return)",     url: "/learn/terms/risk-return.html",     hint: "Learn" },
  { title: "ডাইভারসিফিকেশন (Diversification)",  url: "/learn/terms/diversification.html", hint: "Learn" },
  { title: "মূল্যস্ফীতি (Inflation)",             url: "/learn/terms/inflation.html",       hint: "Learn" },
  { title: "চক্রবৃদ্ধি (Compounding)",           url: "/learn/terms/compounding.html",     hint: "Learn" },
];

/* ---------- Dark mode toggle ---------- */
const themeBtn = document.getElementById("theme-toggle");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const root = document.documentElement;
    const dark = root.getAttribute("data-theme") === "dark";
    if (dark) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
}

/* ---------- Kinetic headline (homepage hero) ---------- */
const kinetic = document.getElementById("kinetic");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (kinetic && !reduceMotion) {
  const words = kinetic.textContent.trim().split(/\s+/);
  kinetic.textContent = "";
  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.className = "w";
    span.style.setProperty("--i", i);
    span.textContent = word;
    kinetic.appendChild(span);
    if (i < words.length - 1) kinetic.appendChild(document.createTextNode(" "));
  });
}

/* ---------- Command palette (Ctrl/Cmd + K) ---------- */
const palette = document.getElementById("palette");
const paletteInput = document.getElementById("palette-input");
const paletteList = document.getElementById("palette-list");
const openBtn = document.getElementById("open-palette");
let activeIndex = 0;
let lastFocusedEl = null;

function openPalette() {
  lastFocusedEl = document.activeElement;
  palette.hidden = false;
  paletteInput.value = "";
  renderResults("");
  paletteInput.focus();
}

function closePalette() {
  palette.hidden = true;
  if (lastFocusedEl) lastFocusedEl.focus();
}

function renderResults(query) {
  const q = query.trim().toLowerCase();
  const matches = SITE_INDEX.filter(item =>
    item.title.toLowerCase().includes(q)
  );
  activeIndex = 0;
  paletteList.innerHTML = "";

  if (matches.length === 0) {
    const li = document.createElement("li");
    li.className = "palette-empty";
    li.textContent = "No matches — try a different word.";
    paletteList.appendChild(li);
    return;
  }

  matches.forEach((item, i) => {
    const li = document.createElement("li");
    if (i === activeIndex) li.className = "active";
    const a = document.createElement("a");
    a.href = item.url;
    const t = document.createElement("span");
    t.textContent = item.title;
    const h = document.createElement("span");
    h.className = "hint";
    h.textContent = item.hint;
    a.append(t, h);
    li.appendChild(a);
    paletteList.appendChild(li);
  });
}

function moveActive(delta) {
  const items = paletteList.querySelectorAll("li:not(.palette-empty)");
  if (items.length === 0) return;
  items[activeIndex]?.classList.remove("active");
  activeIndex = (activeIndex + delta + items.length) % items.length;
  items[activeIndex].classList.add("active");
  items[activeIndex].scrollIntoView({ block: "nearest" });
}

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    palette.hidden ? openPalette() : closePalette();
    return;
  }
  if (palette.hidden) return;
  if (e.key === "Escape") closePalette();
  if (e.key === "ArrowDown") { e.preventDefault(); moveActive(1); }
  if (e.key === "ArrowUp")   { e.preventDefault(); moveActive(-1); }
  if (e.key === "Enter") {
    const link = paletteList.querySelector("li.active a");
    if (link) link.click();
  }
});

paletteInput?.addEventListener("input", () => renderResults(paletteInput.value));
openBtn?.addEventListener("click", openPalette);
palette?.addEventListener("click", (e) => {
  if (e.target === palette) closePalette();
});
