/* Nothing at that address, in the shape the rest of the site uses.

   The Worker's own route never renders this: it calls
   context.next() and the static file (or aab/404.html) answers, so
   a piece that exists as a committed file keeps working. This
   route cannot do that, because it is a different Worker and has
   no ASSETS binding of its own: worker.js only forwards a path
   here once the allowlist says the database owns it. If this page
   is ever seen, the allowlist and the database disagree. */
import { Eyebrow } from "../../../components/ui/label";
import { Button, ButtonLink } from "../../../components/ui/button";

export default function NotFound() {
  return (
    <main id="main">
      <div className="wrap hero">
        <Eyebrow>404</Eyebrow>
        <h1>There is nothing at that address.</h1>
        <p className="lede">
          The piece may have moved, or the link may have a typo in it.
        </p>
        <p><ButtonLink kind="ghost" href="/insights">Back to the index →</ButtonLink></p>
      </div>
    </main>
  );
}
