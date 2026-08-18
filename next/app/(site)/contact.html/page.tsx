/* ============================================================
   /contact.html

   Ported out of `aab/contact.html` with archive/TRANSITION.md Stage 11.5.
   The words are that page's, unchanged: a port that also rewrites
   the page cannot be judged against the page it replaced.

   The form still POSTs to Web3Forms with no JavaScript at all,
   which is the third of the three ways this can go and the reason
   the action and the hidden fields are in the markup rather than
   in a handler. `/contact-form.js` is the other two.
   ============================================================ */

import type { Metadata } from "next";
import { Field, TextArea } from "../../../components/ui/field";
import { Button } from "../../../components/ui/button";
import { pageMeta } from "../../../lib/pageMeta";

export const metadata: Metadata = pageMeta({
  path: "/contact.html",
  title: "Contact · Reiad's Library",
  description: "Contact Rony Reiad: hiring, freelance financial modeling and "
    + "analysis projects, or questions about the Learn hub.",
  ogTitle: "Contact",
  card: "contact",
});

export default function ContactPage() {
  return (

      <main id="main">
        <div className="wrap">
          <div className="hero">
            <span className="eyebrow mono">Contact · Register interest
            </span>
            <h1>Hiring, or need a model built?
            </h1>
            <p className="lede">
              Recruiters, freelance clients, and Learn-hub readers all welcome. The form
          below lands straight in my inbox, or email
          
              <a href="mailto:i@reiad.co.uk">i@reiad.co.uk
              </a> directly.
        
            </p>
          </div>
          <section>
            <span className="section-label mono">Send a message
            </span>
            {/* Web3Forms: the form POSTs to their endpoint, which emails the
             submission to the address tied to the access key. The key is
             designed to be public: it can only send TO you, never read
             anything. "botcheck" is a hidden honeypot: humans never see
             it, spam bots fill it, Web3Forms drops those submissions. */}
            <form
              className="flex flex-col gap-4"
              id="contact-form"
              action="https://api.web3forms.com/submit"
              method="POST"
            >
              <input type="hidden" name="access_key" defaultValue="015ff92f-3694-4e74-bd19-e1c7e62e422b" />
              <input type="hidden" name="subject" defaultValue="New message from reiad.co.uk" />
              <input type="hidden" name="from_name" defaultValue="reiad.co.uk contact form" />
              <input type="checkbox" name="botcheck" tabIndex={-1} className="honeypot" aria-hidden="true" />

              {/* Three fields, and every one of them used to be a
                  bare input inside a wrapping label with no id on
                  it. That works for a mouse and is thin for
                  everything else: nothing tied a message to a
                  field, and the placeholder was doing the label's
                  job. `ui/field.tsx` wires the label, the hint and
                  `aria-describedby` together. */}
              <Field
                id="contact-name"
                name="name"
                label="Name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
              />
              <Field
                id="contact-email"
                name="email"
                label="Email"
                type="email"
                required
                autoComplete="email"
                hint="So I can reply. Nothing else is done with it."
                placeholder="you@example.com"
              />
              <TextArea
                id="contact-message"
                name="message"
                label="Message"
                required
                rows={5}
                placeholder="A few lines about what you need: a role, a project brief, or a question."
              />

              <Button type="submit" id="form-submit" kind="solid" size="lg">
                Send message
              </Button>

              {/* `contact-form.js` writes into this. Kept as an
                  id and a live region, because that module finds
                  it by id and a reader needs the result announced
                  rather than only shown. */}
              <p id="form-status" role="status" aria-live="polite" className="text-t2 text-ink-soft" />
            </form>
          </section>
          <section>
            <span className="section-label mono">Elsewhere
            </span>
            <p>
              <a href="https://www.linkedin.com/in/reiad">LinkedIn
              </a> ·
          
              <a href="mailto:i@reiad.co.uk">i@reiad.co.uk
              </a>
            </p>
          </section>
          <section>
            <span className="section-label mono">What happens next
            </span>
            <div className="rows">
              <div className="row">
                <span className="k mono">Within a business day
                </span>
                <span className="v">A real reply from me, not an autoresponder. If it's a project,
              that reply contains scope, a delivery date and a fixed price.
                </span>
              </div>
              <div className="row">
                <span className="k mono">No sequence, no list
                </span>
                <span className="v">Writing to me does not sign you up to anything. There's no
              newsletter, no CRM, no drip campaign, if you want to know when something
              new is published, use 
                  <a href="/feed.xml">the RSS feed
                  </a>.
                </span>
              </div>
              <div className="row">
                <span className="k mono">Where it goes
                </span>
                <span className="v">The form posts to Web3Forms, which emails it to me and stores
              nothing else. This site sets no analytics cookies and runs no trackers,
              the only thing kept in your browser is your theme choice and which Learn
              terms you've read.
                </span>
              </div>
            </div>
          </section>
          <section>
            <span className="section-label mono">Who this is for
            </span>
            <div className="grid-3">
              <div className="cell">
                <span className="tag mono">Recruiters
                </span>
                <h3>Roles in finance, risk or analysis
                </h3>
                <p>MSc Finance & Risk Management, CFA Level 1 candidate, comfortable in
               Excel, Python and R, and equally comfortable presenting the result to
               people who don't want the technical version. Happy to talk about roles in
               the UK or Bangladesh.
                </p>
                <a className="more" href="/about.html">Full background →
                </a>
              </div>
              <div className="cell">
                <span className="tag mono">Clients
                </span>
                <h3>A model, an analysis, or something written
                </h3>
                <p>Send the brief in whatever state it's in: a paragraph and a spreadsheet
               is enough. You'll get a fixed price and a date back, and the files are
               yours at the end.
                </p>
                <a className="more" href="/portfolio.html">How projects run →
                </a>
              </div>
              <div className="cell">
                <span className="tag mono">Readers
                </span>
                <h3>A question, a correction, a request
                </h3>
                <p>If something on the site is wrong, tell me and I'll fix it and say so.
               If there's a term the Learn hub is missing, or a calculation you keep
               having to do by hand, that's exactly the kind of thing worth building.
                </p>
                <a className="more" href="/money/index.html">শেখার লাইব্রেরি →
                </a>
              </div>
            </div>
          </section>
          <section>
            <span className="section-label mono">Common questions
            </span>
            <div className="stack measure">
              <details className="faq">
                <summary>Can you look at my portfolio and tell me what to buy?
                </summary>
                <p>No: I'm not a licensed adviser and it would be a bad idea from someone
               who doesn't know your income, debts, or what the money is for. What I can
               point you at is the reasoning: the 
                  <a href="/money/index.html">Learn hub
                  </a>
                  for the vocabulary and the 
                  <a href="/tools/index.html">calculators
                  </a> for
               the arithmetic, so the decision stays yours but stops being a guess.
                </p>
              </details>
              <details className="faq">
                <summary>Do you take on students or junior analysts?
                </summary>
                <p>If you're learning this material and get stuck on something specific,
               write to me; a good question is genuinely welcome and often becomes a
               page on this site. I can't offer ongoing mentoring, but I've never
               ignored a serious question.
                </p>
              </details>
              <details className="faq">
                <summary>Can I republish something from this site?
                </summary>
                <p>Ask, and usually yes, with attribution and a link back, and without
               changing the meaning. Bangla explainers especially: the point is that
               they reach people, not that they sit here.
                </p>
              </details>
              <details className="faq">
                <summary>The form isn't working.
                </summary>
                <p>Email 
                  <a href="mailto:i@reiad.co.uk">i@reiad.co.uk
                  </a> directly, that
               always works, and do mention the form failed so I can fix it.
                </p>
              </details>
            </div>
          </section>
        </div>
      </main>
  );
}
