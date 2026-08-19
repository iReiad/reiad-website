/* ============================================================
   school-hub-page.tsx: the three hand-written school hubs, drawn
   from `lib/school-hub-content.ts`.

   The German, Qur'anic Arabic and English hubs were an HTML string
   each. The page around them was React and everything inside them
   was not, so three pages went on wearing furniture the rest of
   the site replaced months ago: the explainer cards were `.cell`,
   which `<InfoCard>` succeeded, and the closing block was
   `.band`, which is `<Band>`. A change to a card reached every
   page except the three a learner opens first.

   ---- what stays HTML, and why that is not a compromise ----

   The prose does. A lede carries `<span lang="de">`, a rung
   carries `<b>`, an answer carries a link, and those are the
   writing rather than the layout. They are rendered with
   `dangerouslySetInnerHTML` from a file in this repository, which
   is the same division the article route already has: the body is
   markup and the page around it is components.

   Structure is the part that was worth moving, because structure
   is what a component library can change for you.

   ---- three ids hub.js reads ----

   `aab/<school>/hub.js` finds `#resume`, the progress line's id
   and the ladder's id, and replaces the ladder with one built
   from the reader's own ticks. It runs after hydration through
   `<SiteScripts>`, so what is rendered here is the
   no-JavaScript fallback and the anchor, not the source. Renaming
   one of those ids breaks the hub silently: the page still draws,
   with the fallback list left in place, which looks fine.

   `aab/schools/hub.test.ts` is the guard and it drives this
   component's own output.
   ============================================================ */

import { HUB_CONTENT, type HubAction, type HubSection } from "../lib/school-hub-content";
import { Band } from "./ui/band";
import { Button, ButtonLink } from "./ui/button";
import { InfoCard } from "./deck";
import { Eyebrow, SectionLabel } from "./ui/label";

/* The hero's own class, written out rather than interpolated.

   `` `hero ${school}-hero` `` reads fine and is invisible: the
   literal `deutsch-hero` then exists nowhere in the source, so
   Tailwind's scanner cannot see it and `check-css.ts` reports
   the rule that uses it as styling nothing, which is how a
   school's layer gets reported as leaking into the whole site.
   A map is three lines and it is three strings that exist. */
const HERO_CLASS: Record<string, string> = {
  deutsch: "deutsch-hero",
  quran: "quran-hero",
  english: "english-hero",
};

/** Prose out of the content file, with its inline markup kept. */
const Html = ({ html, as: Tag = "p", className }: {
  html: string;
  as?: "p" | "div" | "span" | "li" | "h1" | "h2" | "h3";
  className?: string;
}) => <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;

/* A label is markup: an arrow, or a `<span lang>` around a German
   word. It goes inside the link in a span rather than through
   `dangerouslySetInnerHTML` on the link itself, because React
   refuses an element given both that and children, and `children`
   is what a button takes. */
function Actions({ actions, onAccent }: { actions: HubAction[]; onAccent?: boolean }) {
  if (!actions.length) return null;
  return (
    <>
      {actions.map((a) => (
        <ButtonLink key={a.href} href={a.href} kind={a.kind} onAccent={onAccent} size="lg">
          <Html as="span" html={a.label} />
        </ButtonLink>
      ))}
    </>
  );
}

function Section({ section }: { section: HubSection }) {
  const { id, label, intro, cells, rule, ladder, routine, questions } = section;

  return (
    <section id={id} className={ladder ? undefined : "no-filter"}>
      <SectionLabel><Html as="span" html={label} /></SectionLabel>

      {intro ? <Html className="measure ladder-intro" html={intro} /> : null}

      {cells ? (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr))]">
          {cells.map((c) => (
            <InfoCard key={c.title} title={<Html as="span" html={c.title} />} lang="bn">
              <Html as="div" className="card-dek" html={c.html} />
            </InfoCard>
          ))}
        </div>
      ) : null}

      {rule ? (
        <Band tone="soft" label={<Html as="span" html={rule.label} />}>
          <Html as="div" html={rule.html} />
        </Band>
      ) : null}

      {/* The ladder. `hub.js` replaces everything inside the id
          below; the list is what a reader with no JavaScript, and
          a crawler, get instead. */}
      {ladder ? (
        <div className="ladder" id={ladder.listId}>
          <ul className="leiter-fallback">
            {ladder.fallback.map((li) => <Html key={li} as="li" html={li} />)}
          </ul>
        </div>
      ) : null}

      {routine ? (
        <Band
          tone="soft"
          title={routine.title ? <Html as="span" html={routine.title} /> : undefined}
          actions={<Actions actions={routine.actions} />}
        >
          {routine.intro ? <Html className="measure" html={routine.intro} /> : null}
          <ol className="stunde-liste">
            {routine.steps.map((s) => (
              <li key={s.n}>
                <span className="mono">{s.n}</span>
                <Html as="span" html={s.html} />
              </li>
            ))}
          </ol>
        </Band>
      ) : null}

      {questions ? (
        <div className="faq-list stack measure">
          {questions.map((q) => (
            <details className="faq" key={q.q}>
              <summary dangerouslySetInnerHTML={{ __html: q.q }} />
              <Html as="div" html={q.html} />
            </details>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function SchoolHubPage({ school }: { school: string }) {
  const hub = HUB_CONTENT[school];
  if (!hub) return null;
  const { hero, sections, closing, note } = hub;

  return (
    <>
      <div className={`hero ${HERO_CLASS[school] ?? ""}`}>
        <Eyebrow><Html as="span" html={hero.eyebrow} /></Eyebrow>
        <Html as="h1" className="bn-h" html={hero.title} />
        <Html className="lede" html={hero.lede} />

        {/* Where they left off. hub.js fills this when there is
            something to resume; a first-time visitor sees a clean
            start rather than an empty box. */}
        <div id="resume" hidden />

        <div className="progress-line" id={hero.progressId}>
          <span className="track"><i /></span>
          <span className="count" />
          {/* hub.js finds this by id and unhides it once there is
              something to reset. It is a real button rather than a
              chip class, so it gets the focus ring and the tap
              target every other control on the site has. */}
          <Button kind="soft" size="sm" id={hero.resetId} hidden>
            {hero.resetLabel}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Actions actions={hero.actions} />
        </div>
      </div>

      {sections.map((s) => <Section key={s.id} section={s} />)}

      {closing ? (
        <Band
          label={<Html as="span" html={closing.label} />}
          title={<Html as="span" html={closing.title} />}
          actions={<Actions actions={closing.actions} onAccent />}
        >
          <Html html={closing.html} />
        </Band>
      ) : null}

      {note ? <Html as="div" className="note" html={note} /> : null}
    </>
  );
}
