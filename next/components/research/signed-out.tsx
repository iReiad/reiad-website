"use client";

/* A short invitation rather than an empty shell. A redirect would
   lose the address somebody was sent, and a blank page looks
   broken. The routine and the diet board draw the same thing. */

import { Surface } from "../ui/surface";
import { ButtonLink } from "../ui/button";
import { W } from "./lang";

export function SignedOut({ answered }: { answered: boolean }) {
  if (!answered) {
    return <p className="text-t2 text-ink-soft" role="status"><W k="rs.moment" /></p>;
  }
  return (
    <Surface material="pane" className="rs-empty flex flex-col items-start gap-3 px-5 py-6">
      <h2 className="text-t4 font-medium"><W k="rs.signin.head" /></h2>
      <p className="text-t2 text-ink-soft max-w-[52ch]"><W k="rs.signin.body" /></p>
      <ButtonLink kind="solid" href="/account"><W k="rs.signin.go" /></ButtonLink>
    </Surface>
  );
}
