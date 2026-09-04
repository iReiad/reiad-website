/* ============================================================
   research/guide.tsx: the "i" in every room, and what it opens.

   NO CLIENT CODE, deliberately: `popover="auto"` brings the top
   layer, light dismiss, Escape and the focus return, so none of
   the four is implemented here, and a guide that needed a bundle
   to open would not open until the bundle arrived. `keys.ts`
   already stands down while a `[popover]` is open, so j and k do
   not turn a page under the reader while they are reading about
   j and k.

   The content is `lib/research-guide.ts`, keyed by the same
   `key` the pages table uses, and `scripts/check-research.ts`
   fails on a room the guide does not describe. This room's own
   entry is at the top and open; everything else is behind a
   disclosure, because the press that opens this is nearly always
   "what is THIS room for".

   The surface is `<Surface material="glass">`, which is the
   overlay material every other panel on the site wears; only the
   geometry is `.rs-guide` in `@layer research`.
   ============================================================ */

import { GUIDE_FLOWS, GUIDE_KEYS, GUIDE_LAWS, GUIDE_ROOMS, GUIDE_START, guideFor, type RoomGuide } from "../../lib/research-guide";
import { RESEARCH_PAGES } from "../../lib/research-pages";
import { toneVar } from "@reiad/shared/research";
import type { Word } from "@reiad/shared/research";
import { Button } from "../ui/button";
import { Surface } from "../ui/surface";
import { T } from "./lang";

const ID = "rs-guide";

/** The name and the colour a room is drawn with everywhere else.
    The board is not a row of the pages table, so it says its own. */
const roomHead = (key: string): { name: Word; tone: string } => {
  const page = RESEARCH_PAGES.find((p) => p.key === key);
  if (page) return { name: page.tab, tone: toneVar(page.tone) };
  return { name: { en: "Board", bn: "বোর্ড" }, tone: toneVar("gold") };
};

/* A `<div>` and not a `<section>`: `main section` opens with
   `--step` of padding, which is right for the seven a hub is made
   of and 68px of nothing above every heading in a panel. The
   header's tree learnt this first. */
function Steps({ room }: { room: RoomGuide }) {
  const { name, tone } = roomHead(room.key);
  return (
    <div
      className="grid gap-2 border-l-[3px] pl-4"
      style={{ borderColor: tone } as React.CSSProperties}
      data-testid={`rs-guide-room-${room.key}`}
    >
      <h3 className="text-t3 font-medium"><T en={name.en} bn={name.bn} /></h3>
      <p className="text-t2 text-ink-soft"><T en={room.does.en} bn={room.does.bn} /></p>
      <ol className="grid gap-1 text-t2 pl-5 list-decimal">
        {room.steps.map((s) => <li key={s.en}><T en={s.en} bn={s.bn} /></li>)}
      </ol>
      {room.keys?.length ? (
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-t1 text-ink-soft">
          {room.keys.map((k) => (
            <span key={k.press} className="inline-flex items-center gap-2">
              <kbd>{k.press}</kbd>
              <T en={k.does.en} bn={k.does.bn} />
            </span>
          ))}
        </p>
      ) : null}
      {room.note ? (
        <p className="text-t1 text-ink-soft border-t border-hairline pt-2">
          <T en={room.note.en} bn={room.note.bn} />
        </p>
      ) : null}
    </div>
  );
}

/** A part of the guide that is not this room: open it when you
    want it, and it costs nothing to leave shut. */
function Part({ head, children }: { head: Word; children: React.ReactNode }) {
  return (
    <details className="rs-guide-part">
      <summary className="text-t2 font-medium cursor-pointer"><T en={head.en} bn={head.bn} /></summary>
      <div className="grid gap-4 pt-3">{children}</div>
    </details>
  );
}

export function ResearchGuide({ roomKey }: { roomKey: string }) {
  const here = guideFor(roomKey);
  const rest = GUIDE_ROOMS.filter((r) => r.key !== roomKey);
  return (
    <>
      <Button
        kind="ghost"
        size="sm"
        popoverTarget={ID}
        aria-label="Guide to this room / এই ঘরের গাইড"
        title="Guide / গাইড"
      >
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor"
             strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 11v5.5" />
          <path d="M12 7.8v0.1" />
        </svg>
        <span className="sr-only"><T en="Guide" bn="গাইড" /></span>
      </Button>

      <Surface as="div" material="glass" id={ID} popover="auto" className="rs-guide">
        {/* The stack is this wrapper's, never the panel's own: a
            `display` on a `[popover]` is what keeps it open. */}
        <div className="grid gap-4 items-start">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-t4"><T en="How this works" bn="এটা কীভাবে চলে" /></h2>
          <Button kind="quiet" size="sm" popoverTarget={ID} popoverTargetAction="hide">
            <T en="Close" bn="বন্ধ" />
          </Button>
        </div>

        {here ? <Steps room={here} /> : null}

        <Part head={{ en: "The three rules under all of it", bn: "সবটার নিচে যে তিনটা নিয়ম" }}>
          {GUIDE_LAWS.map((law) => (
            <div key={law.title.en} className="grid gap-1">
              <h3 className="text-t2 font-medium"><T en={law.title.en} bn={law.title.bn} /></h3>
              <p className="text-t2 text-ink-soft"><T en={law.body.en} bn={law.body.bn} /></p>
            </div>
          ))}
        </Part>

        <Part head={{ en: "Starting from nothing, in five steps", bn: "শূন্য থেকে শুরু, পাঁচ ধাপে" }}>
          <ol className="grid gap-1 text-t2 pl-5 list-decimal">
            {GUIDE_START.map((s) => <li key={s.en}><T en={s.en} bn={s.bn} /></li>)}
          </ol>
        </Part>

        <Part head={{ en: "Every other room", bn: "বাকি সব ঘর" }}>
          {rest.map((room) => <Steps key={room.key} room={room} />)}
        </Part>

        <Part head={{ en: "The whole keyboard", bn: "পুরো কিবোর্ড" }}>
          <table className="w-full text-t2">
            <thead>
              <tr className="text-t1 text-ink-soft text-left">
                <th className="py-1 pr-3 font-normal"><T en="Where" bn="কোথায়" /></th>
                <th className="py-1 pr-3 font-normal"><T en="Press" bn="কী" /></th>
                <th className="py-1 font-normal"><T en="What happens" bn="কী হয়" /></th>
              </tr>
            </thead>
            <tbody>
              {GUIDE_KEYS.map((row) => (
                <tr key={`${row.where.en}-${row.press}`} className="border-t border-hairline align-top">
                  <td className="py-1 pr-3"><T en={row.where.en} bn={row.where.bn} /></td>
                  <td className="py-1 pr-3 whitespace-nowrap"><kbd>{row.press}</kbd></td>
                  <td className="py-1"><T en={row.does.en} bn={row.does.bn} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Part>

        <Part head={{ en: "Three ways through", bn: "তিনটা পুরো ধারা" }}>
          {GUIDE_FLOWS.map((flow) => (
            <div key={flow.title.en} className="grid gap-1">
              <h3 className="text-t2 font-medium"><T en={flow.title.en} bn={flow.title.bn} /></h3>
              <ol className="grid gap-1 text-t2 text-ink-soft pl-5 list-decimal">
                {flow.steps.map((s) => <li key={s.en}><T en={s.en} bn={s.bn} /></li>)}
              </ol>
            </div>
          ))}
        </Part>
        </div>
      </Surface>
    </>
  );
}
