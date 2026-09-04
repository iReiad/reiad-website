/* A text box, and the label and the error it needs. One component, and
   the label goes with it: a floating `<label>` beside a bare `<input>` is
   how a form ends up with a box nothing announces.

   THE ID IS GIVEN, NOT GENERATED. `useId()` is a hook and there is no
   "use client" anywhere in this app: a field is content, and content is
   rendered on the server. So the caller names it, which is better anyway,
   because the id is what a `<label for>`, an `aria-describedby` and an
   autofill hint all key off.

   THE ERROR IS PART OF THE FIELD: `aria-invalid` and `aria-describedby`
   are wired here, so a field that shows a message announces it. */

import type { ComponentPropsWithRef, ReactNode } from "react";

    /* The box itself is `@layer base`, and this adds nothing to it. The
       stylesheet styles one input, on
       `:is(input:not(...), textarea, select)`, so every box on this site
       is that box whether React made it, a browser module made it, or an
       article carries one.

       A second definition here in utilities would win, because `tw` is a
       later cascade layer than `base`: the pages using this component
       would get `--radius-card` corners over a flat panel while every
       other box on the site had `--radius-sm` over glass. So the only
       thing this adds is width, which is layout rather than looks. */
const BOX = "w-full block";

interface Shared {
  /** Required, and used for the label, the hint and the error.
      See the note above. */
  id: string;
  label: ReactNode;
  /** Said under the box, before anything goes wrong: what format,
      what it is for. Announced with the field rather than after
      it. */
  hint?: ReactNode;
  error?: ReactNode;
  /** The label is read by a screen reader and not drawn. For a
      search box whose magnifier already says what it is. */
  hideLabel?: boolean;
}

function Wrap({
  label, hint, error, hideLabel, id, children,
}: Shared & { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={hideLabel
          ? "sr-only"
          : "text-t1 font-medium tracking-wide uppercase text-ink-soft"}
      >
        {label}
      </label>

      {children}

      {hint && !error ? (
        <p id={`${id}-hint`} className="text-t1 text-ink-soft">{hint}</p>
      ) : null}

      {/* `role="alert"` so a message that appears after a failed
          submit is read out, rather than sitting there for
          somebody who cannot see it turn red. */}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-t1 text-danger">{error}</p>
      ) : null}
    </div>
  );
}

/* `ComponentPropsWithRef` rather than `InputHTMLAttributes`, so a
   `ref` reaches the box. React 19 passes one as an ordinary prop
   and the element takes it; the older type simply did not name
   it, so a caller wanting to focus its own field had to reach for
   `getElementById` and address the box by a string. Two names for
   one thing is how the id and the label came apart in the eleven
   boxes this component replaced. */
export function Field({
  label, hint, error, hideLabel, className, id, ...rest
}: Shared & Omit<ComponentPropsWithRef<"input">, "id">) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <Wrap label={label} hint={hint} error={error} hideLabel={hideLabel} id={id}>
      <input
        id={id}
        className={[BOX, className].filter(Boolean).join(" ")}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
    </Wrap>
  );
}

/** A menu of answers, when there is a fixed list of them.

    Here rather than in its own file because it is the same three
    things a `<Field>` is: a label wired to a control by id, a
    hint, and an error that announces itself. `@layer base` styles
    `select` on the same line it styles `input`, so this adds
    nothing to the box either. */
export function Select({
  label, hint, error, hideLabel, className, id, children, ...rest
}: Shared & Omit<ComponentPropsWithRef<"select">, "id">) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <Wrap label={label} hint={hint} error={error} hideLabel={hideLabel} id={id}>
      <select
        id={id}
        className={[BOX, className].filter(Boolean).join(" ")}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      >
        {children}
      </select>
    </Wrap>
  );
}

export function TextArea({
  label, hint, error, hideLabel, className, id, rows = 4, ...rest
}: Shared & Omit<ComponentPropsWithRef<"textarea">, "id">) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <Wrap label={label} hint={hint} error={error} hideLabel={hideLabel} id={id}>
      <textarea
        id={id}
        rows={rows}
        className={[BOX, "resize-y min-h-24", className].filter(Boolean).join(" ")}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
    </Wrap>
  );
}
