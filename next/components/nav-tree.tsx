/* ============================================================
   nav-tree.tsx: the whole site, from the bar, on any page.

   The rail is a column and a column has room for one level, so
   getting to Stufe 3 means opening the German hub to find the
   link to it. Four pages of the site are one press from anywhere
   and the other 247 are two or three.

   This is the same table read as a tree: five groups, sixteen
   destinations, and under each school the stages it is actually
   made of. `lib/school-stages.ts` is that second level, counted
   out of the schools' own rows by `scripts/build-school-tree.ts`
   rather than listed by hand, and generated rather than queried
   because half this site's routes are prerendered where there is
   no database to ask. Its header says the rest.

   ---- no JavaScript, deliberately ----

   `popover="auto"` brings the top layer, light dismiss, Escape
   and the focus return, so this component implements none of the
   four and ships no client code. It is the argument
   `src/signin.ts` already made for the account menu, and it
   matters more here: this is chrome on 251 pages, and a menu
   that needs a bundle to open is a menu that does not open until
   the bundle arrives.

   It is `[popover]` rather than `<details>` for one reason worth
   keeping: a details element inside the bar cannot escape the
   bar's own stacking context, and the bar is a fixed pill with
   `overflow` and a `z-index` of its own. The top layer is above
   all of it by definition.

   ---- the tree is not a copy of the rail ----

   It reads the same `NAV`, so nothing can drift, but it shows
   what the rail cannot: every group at once rather than the
   reader's ordering, and the level below each destination.
   `unlisted` is skipped for the reason it exists: a link in the
   chrome to a page that answers 403 is a promise the site
   cannot keep.
   ============================================================ */

import { stageUrl, type SchoolStage } from "@reiad/shared/schools";
import { NAV, type NavGroup, type NavItem } from "@reiad/shared/nav";
import { SCHOOL_STAGES, type TreeStage } from "../lib/school-stages";
import { Icon } from "./icons";
import type { Current } from "./shell";

const PANEL_ID = "site-tree";

/** The `key` a school's stages are filed under. `nav.ts` uses the
    school's own id as its key, which is the id the generated
    ladder is keyed by, so the two need no mapping between them. */
const stagesFor = (key: string | undefined): TreeStage[] =>
  (key && SCHOOL_STAGES[key]) || [];

function TreeItem({ item, here }: { item: NavItem; here: string | null }) {
  const key = item.key ?? item.href;
  const current = key === here;
  const stages = stagesFor(item.key);

  return (
    /* The colour goes on the ITEM, not on the link inside it.

       Each destination wears its own, from the same table the
       rail reads, so the tree is sixteen places rather than
       sixteen words. It has to be here because the stages are a
       SIBLING of the link: on the link, `--accent` scoped the
       label and left the four stages under it wearing the
       group's green, so the German ladder was hung off a green
       rule under a blue heading. `styles.css` re-derives the
       whole set on `[style*="--accent"]`, which is what makes one
       declaration enough. */
    <li className="tree-item"
        style={item.accent ? ({ "--accent": item.accent } as React.CSSProperties) : undefined}>
      <a className="tree-link" href={item.href}
         aria-current={current ? "page" : undefined}>
        <span className="tree-ico" aria-hidden="true"><Icon name={item.icon} size={17} /></span>
        <span className="tree-text">
          <span className="tree-label">{item.label}</span>
          {item.sub ? <span className="tree-sub" lang="bn">{item.sub}</span> : null}
        </span>
        {item.soon ? <span className="tree-soon" lang="bn">আসছে</span> : null}
      </a>

      {stages.length > 0 ? (
        <ol className="tree-stages">
          {stages.map((stage) => (
            <li key={stage.slug}>
              {/* The same helper the hub and the lesson footer
                  use, so a stage is linked one way rather than by
                  rebuilding its address here. */}
              <a href={stageUrl(item.key as string, { slug: stage.slug } as SchoolStage)}>
                <span className="tree-stage-name" lang="bn">
                  {stage.kicker ? `${stage.kicker} · ` : ""}{stage.label}
                </span>
                {stage.lessons > 0
                  ? <span className="tree-stage-n mono">{stage.lessons}</span>
                  : null}
              </a>
            </li>
          ))}
        </ol>
      ) : null}
    </li>
  );
}

function TreeGroup({ group, here }: { group: NavGroup; here: string | null }) {
  const items = group.items.filter((i) => !i.unlisted);
  if (items.length === 0) return null;

  return (
    <section className="tree-group" data-group={group.id}
             style={{ "--accent": group.accent } as React.CSSProperties}>
      <h2 className="tree-head mono">{group.label}</h2>
      <ul className="tree-list">
        {items.map((item) => (
          <TreeItem key={item.href} item={item} here={here} />
        ))}
      </ul>
    </section>
  );
}

/** The button in the bar, and the tree it opens. */
export function NavTree({ current }: { current: Current }) {
  const here = current === "in-skills" ? "skills" : (current ?? null);

  /* What the button says: where you are, when the menu names it.
     A page the menu does not name (an article, a case study) gets
     the neutral label rather than a wrong one. */
  const item = NAV.flatMap((g) => g.items).find((i) => (i.key ?? i.href) === here);

  return (
    <>
      <button className="tree-btn" type="button"
              popoverTarget={PANEL_ID}
              aria-label="Browse every page">
        <span className="tree-btn-ico" aria-hidden="true">
          <Icon name={item?.icon ?? "menu"} size={17} />
        </span>
        <span className="tree-btn-text">{item?.label ?? "Browse"}</span>
        <span className="tree-btn-chev" aria-hidden="true"><Icon name="chevron" size={14} /></span>
      </button>

      <div className="tree-panel" id={PANEL_ID} popover="auto">
        <div className="tree-cols">
          {NAV.map((group) => (
            <TreeGroup key={group.id} group={group} here={here} />
          ))}
        </div>
      </div>
    </>
  );
}
