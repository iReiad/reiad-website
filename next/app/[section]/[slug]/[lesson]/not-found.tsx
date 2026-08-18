/* Nothing at that address, in Bangla, because everything that
   answers on this route is.

   A 404 from this Worker is how it says "not mine": `fromNext()`
   in `worker.js` turns one into the fall-through to the asset
   router, which is what keeps all 251 generated pages answering
   while `NEXT_ROUTES` says nothing about the schools. So this
   page is what a reader sees only once a school address is
   forwarded here AND the database has no such lesson, which is a
   real state: a stage's ladder can name a lesson that has not
   been written, and a link somebody saved can outlive one. */
import { Eyebrow } from "../../../../components/ui/label";

export default function NotFound() {
  return (
    <main id="main">
      <div className="wrap hero">
        <Eyebrow>404</Eyebrow>
        <h1 className="bn-h">এই ঠিকানায় কিছু নেই।</h1>
        <p className="lede">
          লেখাটা হয়তো সরে গেছে, বা লিংকে টাইপো আছে।
        </p>
        <p><a className="btn btn-ghost" href="/skills/index.html">সব শেখার জায়গা →</a></p>
      </div>
    </main>
  );
}
