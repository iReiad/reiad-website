/* What a reader who is not the owner sees: the site's own 404, in the
   same words `aab/404.html` uses, inside the shell. `notFound()` in
   `components/work-alpha/mount.tsx` lands here. */

import { ButtonLink } from "../../../components/ui/button";

export default function WorkAlphaNotFound() {
  return (
    <main id="main" className="wrap">
      <div className="hero" style={{ paddingBlock: "80px 30px" }}>
        <span className="eyebrow mono">404 · এই পাতাটি নেই</span>
        <h1>That page isn&apos;t here.</h1>
        <p className="lede">
          Either it moved, or the link was wrong, or I broke something. If you
          followed a link from somewhere on this site,
          {" "}<a href="/contact">tell me</a>, that&apos;s a bug and I&apos;ll fix it.
        </p>
        <div className="hero-actions">
          <ButtonLink kind="solid" href="/">Back to the start</ButtonLink>
        </div>
      </div>
    </main>
  );
}
