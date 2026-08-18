/* ============================================================
   ui/field.tsx: a text box, and the label and the error it needs.

   `styles.css` styles an input in eleven places, once per page
   that has one, and they disagree: the Studio's, the desk's, the
   contact form's, the gate's, the term filter's and the stock
   check's all pick their own padding, their own border and their
   own focus ring. Five of them set `outline: 2px solid
   var(--accent)` by hand because there was nowhere to get it
   from.

   One component, and the label goes with it. That is the part
   worth insisting on: a floating `<label>` beside a bare
   `<input>` is how a form ends up with a box nothing announces,
   and every one of those eleven had to remember `for` and `id`
   separately.

   ---- the id is given, not generated ----

   `useId()` is a hook, and there is no "use client" anywhere in
   this app: a field is content, and content is rendered on the
   server. So the caller names the field. That is not a
   concession, it is better: the id is what a `<label for>`, an
   `aria-describedby` and an autofill hint all key off, and one
   the component invented would be a string nothing else could
   name.

   ---- the error is part of the field ----

   Not a paragraph somebody remembers to put underneath.
   `aria-invalid` and `aria-describedby` are wired here, so a
   field that shows a message announces it, which is the whole
   difference between a form that is accessible and one that
   looks it.
   ============================================================ */

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

/* The box itself, shared by the input and the textarea so the two
   cannot drift. */
const BOX = [
  "w-full block",
  "bg-panel text-ink",
  "border border-pane-edge rounded-[var(--radius-sm)]",
  "px-3.5 py-2.5 text-t3 font-[inherit]",
  "transition-[border-color,box-shadow,background-color]",
  "duration-[var(--fast)] ease-[var(--ease)]",
  "placeholder:text-ink-soft placeholder:opacity-70",
  "hover:border-accent-line",
  "focus:outline-2 focus:outline-offset-2 focus:outline-accent",
  "focus:border-accent focus:bg-panel-hover",
  "disabled:opacity-55 disabled:cursor-not-allowed",
  "aria-[invalid=true]:border-danger",
].join(" ");

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

export function Field({
  label, hint, error, hideLabel, className, id, ...rest
}: Shared & Omit<InputHTMLAttributes<HTMLInputElement>, "id">) {
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

export function TextArea({
  label, hint, error, hideLabel, className, id, rows = 4, ...rest
}: Shared & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id">) {
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
