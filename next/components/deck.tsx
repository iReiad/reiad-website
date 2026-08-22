/* ============================================================
   deck.tsx: the two kinds of card, as components.

   `@layer deck` in `styles.css` is the styling and the note at
   the top of it is the argument. This is the markup, and its one
   job is to make the distinction hard to get wrong: a card that
   takes you somewhere is `<GoCard>` and is an `<a>`; a card that
   tells you something is `<InfoCard>` and is a `<div>`. Neither
   can be the other by accident, which is what happened when both
   were `.cell` and the difference was whichever tag the author
   reached for.

   ---- the accent ----

   Every card carries one colour, passed as `accent` and used for
   the rail, the icon tile, the chip and the arrow. Passing it
   rather than deriving it from a section means one list of
   sections, in `shared/nav.ts`, decides what colour a thing is
   wherever it appears: in the rail, in the footer and on a card.
   ============================================================ */

import type { CSSProperties, ReactNode } from "react";
import { Icon } from "./icons";

type Common = {
  /** The drawing in the tile. Omitted, and there is no tile. */
  icon?: string;
  /** A colour token, `var(--green)` by default. */
  accent?: string;
  /** The little mono label above the title. */
  chip?: string;
  title: ReactNode;
  /** The language the title and blurb are in, when it is not the
      page's. A Bangla title needs the Bangla serif face. */
  lang?: string;
  dek?: ReactNode;
  /** Anything under the blurb: a meter, a list, a set of facts. */
  children?: ReactNode;
  className?: string;
};

const style = (accent?: string) =>
  (accent ? { "--accent": accent } as CSSProperties : undefined);

function Inside({ icon, chip, title, dek, children }: Common) {
  return (
    <>
      {(icon || chip) ? (
        <div className="card-top">
          {icon ? <span className="card-art"><Icon name={icon} size={20} /></span> : null}
          {chip ? <span className="card-chip">{chip}</span> : null}
        </div>
      ) : null}
      <h3 className="card-title">{title}</h3>
      {dek ? <p className="card-dek">{dek}</p> : null}
      {children}
    </>
  );
}

/** A card that takes you somewhere, or does something. */
export function GoCard({
  href, go, done, ...rest
}: Common & {
  href: string;
  /** What happens when you press it, written out. A node rather
      than a string because one card's action is in Bangla and the
      rest of it is not: `lang` on the card would put the English
      title in the Bangla serif to get the last line right. */
  go: ReactNode;
  /** Ticked, for anything a reader has finished. */
  done?: boolean;
}) {
  return (
    <a className={["card", rest.className].filter(Boolean).join(" ")}
       data-kind="go" data-done={done ? "" : undefined}
       /* The light is what a card that answers you has and a card
          that does not has none of. `<InfoCard>` and `<SoonCard>`
          below deliberately carry no `data-glow`: they are the
          end of the road, and the same distinction the rail and
          the arrow already draw is drawn once more by the one
          thing a pointer can test without clicking. */
       data-glow="card"
       href={href} lang={rest.lang} style={style(rest.accent)}>
      {done ? <span className="card-tick" aria-label="পড়া হয়েছে">✓</span> : null}
      <Inside {...rest} />
      <span className="card-go">{go}</span>
    </a>
  );
}

/** A card that tells you something and is the end of the road.

    `fill` is the one variant it has: the card printed in the
    accent rather than on the paper, for the last card in a set
    that is the conclusion of the others. One card on the site
    uses it, and it was `.cell-aim` in the stylesheet, whose rule
    coloured `.tag` and `h3`: two names the deck does not render,
    so as a `.cell` it worked and as a card it would silently have
    lost its chip. */
export function InfoCard({ fill, ...props }: Common & { fill?: boolean }) {
  return (
    <div className={["card", props.className].filter(Boolean).join(" ")}
         data-kind="info" data-fill={fill ? "" : undefined}
         lang={props.lang} style={style(props.accent)}>
      <Inside {...props} />
    </div>
  );
}

/** A card for something that has been promised and not written.
    It is a `div` for the same reason a chip that goes nowhere is
    not a link. */
export function SoonCard({ soon = "আসছে", ...props }: Common & { soon?: string }) {
  return (
    <div className={["card", props.className].filter(Boolean).join(" ")}
         data-kind="soon" lang={props.lang} style={style(props.accent)}>
      <Inside {...props} chip={props.chip ?? soon} />
    </div>
  );
}

/** A bar, with its numbers written beside it. Used wherever
    something is partly done: a stage, a school, the whole
    library. */
export function Meter({
  value, total, label, accent,
}: {
  value: number;
  total: number;
  label?: string;
  accent?: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="meter-line" style={style(accent)}>
      <span className="meter" role="progressbar" aria-valuenow={pct}
            aria-valuemin={0} aria-valuemax={100}
            aria-label={label ?? "Progress"}>
        <i style={{ width: `${pct}%` }} />
      </span>
      <span>{label ?? `${pct}%`}</span>
    </div>
  );
}

/** The same number as a ring, for the head of a page rather than
    the body of a card. */
export function Ring({ value, total, accent }: { value: number; total: number; accent?: string }) {
  const pct = total > 0 ? Math.min(1, value / total) : 0;
  const r = 19;
  const circumference = 2 * Math.PI * r;

  return (
    <span className="progress-ring" style={style(accent)}>
      <svg viewBox="0 0 44 44" aria-hidden="true">
        <circle className="ring-track" cx="22" cy="22" r={r} fill="none" strokeWidth="4" />
        <circle className="ring-fill" cx="22" cy="22" r={r} fill="none" strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - pct)} />
      </svg>
      <span className="ring-num">{Math.round(pct * 100)}</span>
    </span>
  );
}
