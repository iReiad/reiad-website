/* ============================================================
   sw.js: the service worker.

   Goal: the site keeps working on a bad connection or none at
   all, without ever showing anyone a stale article.

   Strategy, split by what the thing is:

     HTML       network first. You always get the live page when
                the network answers; the cached copy is the
                fallback, and /offline.html is the fallback's
                fallback.
     CSS/JS     stale-while-revalidate. Instant from cache, then
                quietly refreshed for next time.
     Fonts/img  cache first: they don't change, and when they
                do they change name.

   Bump VERSION to retire every old cache in one go.
   ============================================================ */

/* Bump this to retire every old cache. v2: a broken _redirects file
   briefly made several pages unreachable, so any client that cached
   an offline fallback during that window gets a clean slate.

   v3: this file is the only thing that retires a cache, and it did
   not change when the dynamic layer landed, so every returning
   visitor kept being served the shell-v2 copy of app.js, from before
   countView() existed, and kept being served it forever (a script is
   answered from the cache that has it, and only a new VERSION empties
   that cache). Page views went uncounted, and the fix to the Studio
   login could not have reached anyone either. Bump this whenever a
   precached file changes.

   v69: /learn/contents.html changed, and it is precached. The
        money school's builder was emitting a nav that linked to
        Deutsch where the whole rest of the site links to Skills,
        so its 72 generated pages had been drifting away from
        every hand-written page for as long as that link has
        existed. Fixed at the template, which rewrites all of
        them. A returning reader holding the v68 contents page
        would keep the wrong link.

   v68: styles.css changed, and it is precached. The desk's More
        panel used to hang off the More button's right edge and
        grow leftward, so on a narrow window Publish, Delete and
        the Move to picker sat past the left border of the page
        with no way to scroll to them. It hangs off the actions row
        instead and grows from that row's start edge, so both of
        its edges stay inside the row. A returning reader holding
        the v67 stylesheet would keep the unreachable version of
        that menu.

   v67: TRANSITION.md Stage 8. The Quran school's curriculum.js is
        precached and it changed: allLessons(), totalDays(),
        findDhap() and findByPath() take the ladder as an argument
        now, defaulting to this file's own, so a builder can hand
        them one read from the database. No caller passes one yet
        and no page reads differently, but a returning reader
        holding the v66 copy would be holding a module the next
        one is expected to be able to replace.

   v66: the old Studio and the old desk were archived. studio.html,
        studio.js, desk.html and desk.js are in archive/ and are
        not deployed; _redirects sends their two URLs to /studio/
        and /desk/. app.js changed, because its prerender rules
        named the old page, and insights.html changed with it. A
        returning reader holding a v65 app.js would be told to
        prerender a URL that is now a redirect.

   v65: Stage 7, comments. Signed in to write, and nothing appears
        until it is approved from the desk. comments.js is new and
        the article renderer loads it lazily; styles.css and
        desk.js both changed. The Worker verifies the reader's
        Supabase token against the project's public keys before it
        believes a single claim, because without that the author of
        a comment is whatever the poster typed.

   v64: the money ladder could not be reset, and now can. app.js
        runs recordVisit() from /learn/progress.js on every page of
        the site, and its selector claimed any article carrying a
        data-lesson-id. The Qur'an school's lessons and the English
        school's parts carry one too, so ninety pages of other
        schools marked themselves as money ladder lessons: the
        ladder's percentages counted them, and clearing it on the
        hub was undone by opening any Arabic or English lesson.
        readSet() also drops foreign ids it already holds, so a
        polluted device heals itself, which is a change to a
        precached module every reader has.

   v63: Stage 4. The Studio no longer offers to publish as files:
        "Download the page", the .zip export and "Get the index
        entry" described a workflow that ended when the last piece
        moved into the database, and they were the last thing
        keeping buildPage() alive, which was a SECOND renderer for
        an article and had drifted from the server's twice. 309
        lines of studio.js are gone with them, and the page-weight
        meter now measures the body against the 1 MB the server
        actually enforces rather than a whole rendered page against
        an imaginary 2 MB. studio.html and styles.css changed too.

   v62: three things a reader reported. Resetting progress while
        signed in did nothing, because every school's resetAll()
        removes its key rather than emptying it and the guard in
        sync.js only recognised an empty array, so the account's
        copy came straight back. Signing in on a second browser
        silently pushed that browser's progress into the account
        for ever; it asks now, once, and only when both sides hold
        something. first-sync.js is new and sync.js loads it
        lazily, so a v61 shell would reach a module it does not
        have at the one moment it matters.

   v61: photos reach R2 at last, and links share the piece's own
        picture. Reading a pasted photo back out of the editor was
        a fetch of a data: URL, which is governed by connect-src
        and not by img-src: the policy allowed data: under img-src,
        so photos DISPLAYED, and every attempt to upload one was
        blocked before it left the browser. R2 stayed empty, every
        cover stayed empty, every shared link showed the default
        card. photo.js is new and shared by studio.js and desk.js,
        both of which changed, and the desk can now repair a piece
        that was published while this was broken.

   v60: the desk names the migration it has been quietly offering.
        The primary action on a committed file says Import rather
        than Edit, because publishing from that door is the piece
        moving into the database, and the count line says how many
        are left to import rather than only how many exist.
        desk.js and styles.css both changed.

   v59: an account can be set up rather than just held. The account
        page asks three things, each of which changes something the
        reader can point at, and arrives with the answers already
        filled in from what this device knows. streak.js is new and
        app.js imports it eagerly, so a v58 shell would serve a
        cached app.js whose import 404s and lose the menu and the
        palette with it. content.js grew COURSES, which home.js and
        account-page.js both read.

   v58: the menu stopped being modal. It opens under the header
        instead of over it, so the real search, theme and account
        buttons stay where they are and stay clickable, and the
        real Menu button becomes the close button. The bar of
        copies it used to carry, and the two measuring passes that
        kept those copies standing in the right place, are gone.
        app.js and styles.css both changed and they have to change
        together: a v57 app.js would call showModal() into a
        stylesheet that no longer gives the dialog a backdrop.

   v57: the home page reads the reader before it reads the site. The
        band that says where you were now asks all four schools
        rather than the two that existed when it was written, sits
        above the hero the moment it has anything in it, greets a
        signed-in reader by name, and tells a signed-out one that
        their place is on this device only. home.js, index.html and
        styles.css all changed, and a v56 shell would keep serving
        the version that offered German to somebody three ধাপ into
        the Qur'an school.

   v56: progress follows the account. sync.js copies the keys the
        four schools already write up to Supabase and back, merging
        rather than overwriting, and /account.html is the page that
        says what is kept and lets a name be changed. signin.js
        imports sync.js at the top, so a v55 shell would have a
        sign-in button that never loads.

   v55: the menu's close button is placed on top of the Menu button
        that opened it, measured rather than imitated. The old bar
        lined up by holding the same three buttons in the same
        order, which stopped being true the moment the header grew
        a fourth for accounts. app.js and styles.css both changed.

   v54: signing in stopped making people wait for it. The header
        now reads the name out of the access token instead of
        asking Supabase who you are, and the import that starts all
        this moved ahead of the service worker's own registration:
        behind a shell precaching sixty files, returning from Google
        left the header saying "Sign in" for half a minute while the
        reader was, in fact, signed in. app.js, account.js and
        signin.js all changed.

   v53: readers can sign in. app.js loads /signin.js, which loads
        /account.js, and both are precached so the button survives
        offline. styles.css gained the header button and the panel.
        Nothing on the site requires an account and nothing changes
        for a reader who never signs in, which is why this bump is
        about a cached app.js finding its new import rather than
        about anything a reader would notice.

   v52: one list of pieces. app.js, reads.js and the two card hosts
        now ask /pieces.js what has been written, and it merges the
        database with content.js, so a piece published through the
        Studio appears on its own hub, in the menu, in the palette
        and in the count. app.js imports the new module, so a v51
        shell would serve a cached app.js whose import resolves to
        nothing and lose the menu and the palette at once.

   v51: the Studio and the desk on a phone. A single-column grid
        track floors at its widest child, so the row of writing
        tools held the whole editor pane at 418px inside a 390px
        screen and every field went with it; the tools are one
        sideways-scrolling row now, and a photo in an article lines
        up with the words instead of running past both sides of
        them. styles.css is precached and none of it is legible
        without the new rules.

   v50: the blocks a long read is made of moved out of the reading
        sections and into the article layer, so the Studio can put
        one in any piece. Two of them were renamed on the way, .glance
        to .at-a-glance and .dhap-list to .step-list, because .glance
        was already the About page's and .steps already the Learn
        hub's, and a later layer wins everywhere. styles.css and both
        Bangla pieces changed together: a cached v49 styles.css would
        draw the renamed boxes as unstyled lists, and a cached v49
        page would ask for classes the new stylesheet no longer has.

   v49: the travel desk landed at /travel/, the kitchen and it now
        share one module and one cascade layer, and the Studio
        learned where things go. content.js grew SECTIONS, which
        content.js, crumbs.js, reads.js, studio.js and desk.js all
        read, so a returning visitor on the v48 shell would be
        served a cached content.js with no SECTIONS in it and lose
        the menu, the palette and both index pages at once.
        /cooking/cooking.js is gone, replaced by /reads.js, which
        is precached in its place along with both travel pages.

   v48: the kitchen landed at /cooking/, with its first piece.
        Smaller than a school and still not optional: content.js
        grew a COOKING array that the hub, the palette and the
        sitemap read, styles.css grew a cooking layer, and
        crumbs.js grew the trail. A returning visitor on the v47
        shell would be served a cached content.js with no COOKING
        in it, and /cooking/index.html would render its
        no-JavaScript fallback while the console filled with
        import errors. The index and its one piece are precached;
        the piece is a single page and worth having offline,
        which is where a recipe is usually read.

   v47: the English school landed, two terms over thirty parts,
        with a thirty-day practice book. Not optional, and for the
        same reason v46 was not: content.js now imports
        /english/curriculum.js, and app.js and crumbs.js import
        content.js, so a returning visitor holding the v46 shell
        would be served a cached content.js whose new import
        resolves to nothing, and the menu, the palette and the
        breadcrumbs would die together. The school's own modules
        are precached alongside it. styles.css gained the english
        layer, crumbs.js gained the trail, and skills.js now reads
        three schools' progress rather than German's alone.

   v46: the Quranic Arabic school landed, sixty days over three
        ধাপ. Not optional in the way a styling change is, and for
        the same reason v21 was not: content.js now imports
        /quran/curriculum.js, and app.js and crumbs.js import
        content.js, so a returning visitor holding the v45 shell
        would be served a cached content.js whose new import
        resolves to nothing, and the menu, the palette and the
        breadcrumbs would die together. The school's own modules
        are precached alongside it. styles.css gained the quran
        layer and the Arabic typography, crumbs.js gained the
        trail, and the German pages changed too: their header had
        been writing a Deutsch link the rest of the site stopped
        carrying when the schools moved under Skills.

   v45: the practice book's day tracker folds away. At ninety days
        it was thirteen rows of squares on a phone, which put the
        book itself a screen and a half below the fold, and the
        same wall was there at sixty and thirty. styles.css and the
        Stufe 1 workbook are precached, so without the bump a
        returning learner keeps the wall.

   v44: Stufen 2, 3 and 4 landed, so the German school went from
        fourteen written Teile to fifty-six, and from one practice
        book to three. curriculum.js, content.js, crumbs.js,
        hub.js, progress.js, styles.css, the German hub and Stufe
        1's own pages all changed, and every one of them is
        precached. Without the bump a returning visitor holds a
        shell whose ladder still says three stages are unwritten,
        whose resume card only knows Stufe 1's thirty days, and
        whose workbook script has not learned that the typed-in
        boxes are namespaced per Stufe now, so day 1 of the new
        books would open showing what was written on day 1 of the
        old one. The two new books are deliberately NOT precached;
        see the note on the list itself.

   v43: the menu lost the twelve links that opened pages saying
        আসছে, and its close button moved to where the button that
        opened it stands. The About page's research cards open a
        mini window into the case study each one became. Switching
        audience reloads, because the home page picks its headline
        before the CSS runs and a switch without a reload left the
        two disagreeing. Navigation animates in a direction, cards
        lean to a phone's tilt, and app.js publishes --header-inset
        for the menu to line up with. app.js, styles.css,
        content.js, tilt.js and news.js all changed together.

   v42: the site counts itself now. content.js gained COUNTS and
        app.js the [data-count] filler that reads it, home.js
        rebuilds the home page's case-study list, featured piece
        and next-up card from the manifest, and styles.css turned
        light mode very slightly sepia, moved the gold accent two
        points darker to hold AA on it, fixed a grid that let the
        three-statement tables scroll the whole page sideways on a
        phone, and narrowed the menu columns so the case studies
        stop landing below the fold. The webfont stylesheet stopped
        blocking the first paint on every page at the same time.
        Almost every precached file changed, and the markup is not
        legible without the rules that go with it.

   v41: the portfolio page was rebuilt around the work rather than
        around the description of it, and it now carries all seven
        case studies rather than the four it was written against.
        styles.css gained the components that page is set in: the
        terms row, the card art and facts, the featured case-study
        card, the row list under it, and the credentials panel.
        .chips moved out of the About layer into components at the
        same time, since two pages list a toolkit now. The markup is
        useless without those rules, so the stylesheet has to arrive
        with it rather than one deploy behind.

   v40: the portfolio-construction page was rebuilt around the fund
        as it was actually held, rather than around the optimised
        alternatives. styles.css gained the security market line and
        the negative-beta bar, and is precached, so a returning
        reader would otherwise get the new charts with none of the
        rules that colour them.

   v39: the portfolio-construction case study landed. content.js
        gained its entry, which is what puts it in the Ctrl+K
        index, and styles.css gained the frontier, the correlation
        matrix and the risk bars. Both are precached, so a
        returning reader would otherwise keep the old pair.

   v38: the probability-of-default case study landed. content.js
        gained its entry, which is what puts it in the Ctrl+K
        index, and styles.css gained the page's charts. Both are
        precached, so a returning reader would otherwise keep the
        old pair and never see the new page in search.

   v37: the stress-testing case study landed. content.js gained its
        entry, which is what puts it in the Ctrl+K index, and
        styles.css gained the page's charts plus one fix that
        reaches every page: .formula no longer inherits .mono's
        uppercase, which had been turning lowercase Greek into
        different letters (ρ into Ρ, σ into Σ) in the formulas on
        the dissertation page as well as this one. Both files are
        precached, so a returning reader would otherwise keep the
        old pair.

   v36: the em dash is gone from the whole site. 1,420 of them became
        commas, colons or en dashes, in page copy, in Bangla lesson
        text, in the strings scripts write into the DOM and in the
        comments. Nearly every precached file changed.

   v35: both hubs carry the free-education pledge, and styles.css
        gained the .pledge component it is set in. Markup and
        stylesheet again have to arrive together.

   v34: the home page's three link lists were cut back to three rows
        and one line each, thirteen rows of blurb between a visitor
        and the cards below them. index.html only, but it is
        precached, so a returning reader would keep the long one.

   v33: Studio exports and dynamic articles now keep their lead photo
        in the social-preview metadata instead of falling back.
   v32: the public site identity became Reiad's Library.
   v31: the search palette gained a dedicated visual hierarchy.
   v30: the homepage route cards gained a slight resting shadow.
   v29: the homepage route cards gained their own visual treatments.
        The homepage shell and stylesheet must arrive together, or a
        returning reader gets the previous first-screen design.
   v28: the bento got the top padding every other block on the home
   page has always had. styles.css, so it needs the bump.

   v27: one line out of the home page's services cell, which made
   that card taller than the two beside it and put a band of empty
   panel across the whole row. index.html is precached, so the
   offline copy has to move with it.

   v26: the home page's intro stopped depending on app.js and
   styles.css being in step with it. Worth spelling out here,
   because the shape of THIS cache is what made it matter: HTML is
   network-first and everything else is served from cache and
   refreshed behind you, so the first load after any deploy pairs
   new markup with the PREVIOUS app.js and styles.css. That is a
   good trade for a reading site right up until the markup stops
   being legible without them, four headlines were spans inside
   the element app.js rebuilds word by word, and the older app.js
   welded them into one paragraph. The selection now ships inside
   the document, so the pairing is harmless again.

   v25: the header's Deutsch link became a Skills dropdown, the
   home page grew a welcome-back band, and app.js gained three new
   imports (recent, tilt, and by way of home.js the shared news
   module). A returning reader served the v24 shell would get the
   old app.js, whose imports of /recent.js and /tilt.js do not
   exist in it, so the whole module would fail to evaluate and
   every page would lose its menu, its palette and its theme
   toggle at once.

   v24: `header` and `footer`. The page chrome was claimed with
   bare element selectors, so every <header> and <footer> nested
   inside an article got position:sticky, z-index:50 and the glass
   blur, the practice book's day header pinned itself over the
   site's own and hid the top of every day, and the five
   calculator panels on /tools/ had been carrying a four-line
   workaround for the same thing. Scoped to `body >`. styles.css
   again, and the practice book's markup with it.

   v23: .tag. The German school styled a class the whole site
   already used for the small label above an article card, and
   because a school's layer beats components everywhere, every
   card on the site grew an empty bordered box around its label.
   styles.css, the practice book and its script all changed, and
   all three are precached, without the bump the fix would have
   reached nobody who had been to the site before. check-css.mjs
   now fails on the general case.

   v22: the German school's first fixes, the practice book's
   boxes are usable with scripts off, the resume card offers
   whichever half is actually behind, the Teil cards match the
   Learn cards again, and a print rule that was hiding every
   page's buttons is scoped where it belongs. styles.css,
   deutsch/hub.js, deutsch/arbeitsbuch.js and the German pages
   are all precached, so none of it reaches a returning visitor
   without this.

   v21: the German school landed. This one is not optional in the
   way a styling change is: content.js now imports
   /deutsch/curriculum.js, and app.js and crumbs.js import
   content.js. A returning visitor holding the v20 shell would be
   served a cached content.js whose new import resolves to
   nothing: the menu, the palette and the breadcrumbs would all
   die together. So the German modules the shell depends on are
   precached alongside it, and the version moves.

   v20: app.js merges database articles into the Ctrl+K index,
   api.js caches the article list, and styles.css gained the folded
   file-publishing tools. All three are precached.

   v19: content.js lost a live article whose slug could never
   resolve, and the Studio learned to open the file-based pieces,
   content.js and styles.css both changed.

   v18: the preview grew a card view, a share-card view, width and
   theme switches, and the per-article social image that goes with
   them, styles.css again.

   v15–v17: the Studio rebuild, in three passes. api.js gained the
   media and Notion clients (v15); styles.css gained the slash menu,
   the figure toolbar and the pre-flight panel (v16); and the desk
   moved onto its own page, taking the dashboard's styles with it
   (v17). styles.css is precached and changed in all three, which is
   exactly the shape of the v3 and v10 mistakes, check-sw.mjs caught
   each one before it shipped.

   v12: the About page was rebuilt, new markup, a new `about`
   cascade layer in styles.css and a small about.js that counts the
   library from content.js rather than trusting a typed number.

   v11: a UI pass, the modal reader prefetches and retries, the
   menu and palette were restructured, the home page gained a
   Bangla half and a models section, and the learn hub's doors
   became buttons. styles.css, app.js, content.js, learn.js,
   hub.js and three precached pages all changed. check-sw.mjs
   caught this one before it shipped, which is what it is for.

   v10: THE SAME MISTAKE AS v3, MADE AGAIN. The stock check shipped
   at v9 and was then fixed three times, the valuation cap, the
   header and slider repairs, and the pillar contributions, each
   touching precached files, and VERSION was not bumped once. Every
   returning visitor kept being served the v9 copies and could not
   see any of it. The reader who reported it was quoting text from
   a string table two commits old.

   The structural fix is below in the fetch handler: the runtime
   cache is now consulted BEFORE the shell, so a background refresh
   actually takes effect. A missed bump now costs one stale load
   instead of freezing a file forever. check-sw.mjs guards the rest.

   v9: the stock check landed, a new page under /tools/ with its
   own engine, string table and stylesheet block, plus a changed
   crumbs.js. styles.css changed too, and a cached v8 copy would
   render the new page unstyled.

   v8: the index volatility & drawdown case study landed.

   v7: the DCF case study landed alongside the operating model.

   v6: the tools page became a tab set and the first interactive
   portfolio case study landed, so tools.js, styles.css and the new
   /portfolio/ modules all changed together.

   v5: added /activation.js (imported by app.js via api.js and
   progress.js) and the new /learn/contents.html. A cached v4
   app.js would fail to resolve the new import.

   v4: the Learn area was restructured, app.js gained three new
   imports (crumbs, audience, learn progress) and the hub is a
   different page. Without a bump, a returning reader would be
   served the v3 app.js forever and none of it would appear. */
const VERSION = "v69";
const SHELL = `shell-${VERSION}`;
const RUNTIME = `runtime-${VERSION}`;

/* Worth having before it's needed, so the first offline visit works.

   app.js is an ES module and its imports are separate requests, so
   each one has to be listed: a cached app.js whose imports 404 is
   worse than no app.js at all. Lesson pages are deliberately NOT
   precached: there are seventy of them, and the runtime cache
   picks up the ones a reader actually opens. */
const PRECACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/styles.css",
  "/app.js",
  "/content.js",
  "/api.js",
  /* app.js imports this, so a shell without it is an app.js whose
     import resolves to nothing: the menu, the palette and every
     list of writing die together on the first offline visit. */
  "/pieces.js",
  /* Reader accounts. app.js imports signin.js lazily and catches a
     failure, so an offline visit without these is a page with no
     sign-in button rather than a broken one, but the button is
     cheap to keep. */
  "/signin.js",
  "/account.js",
  /* signin.js imports sync.js at the top, so a shell without it is
     a shell whose sign-in button never loads. */
  "/sync.js",
  "/account.html",
  "/account-page.js",
  /* app.js imports this one EAGERLY, at the top, unlike the three
     above: a shell without it is an app.js whose import 404s, and
     that takes the menu and the palette with it. */
  "/streak.js",
  /* studio.js and desk.js both import this, and a shell without it
     is an editor that cannot save a photo. */
  "/photo.js",
  /* sync.js imports this lazily, at the one moment it is needed:
     the first time a device meets an account that already has
     progress. Offline is exactly when that import must not 404. */
  "/first-sync.js",
  /* Loaded lazily by an article page. Precached so a thread still
     draws for somebody reading offline. */
  "/comments.js",
  "/crumbs.js",
  "/audience.js",
  "/activation.js",
  /* app.js imports these two directly, so a cached app.js without
     them is an app.js whose imports 404, which is worse than no
     app.js at all. home.js and news.js belong to the home page and
     the Insights page and are listed with them. */
  "/recent.js",
  "/tilt.js",
  "/home.js",
  "/news.js",
  "/skills/index.html",
  "/skills/skills.js",
  "/learn/index.html",
  "/learn/learn.js",
  "/learn/hub.js",
  "/learn/curriculum.js",
  "/learn/progress.js",
  "/learn/icons.js",
  "/learn/contents.html",
  "/learn/contents.js",
  /* The German school. curriculum.js is not a nicety here: it is
     an import of content.js, which is an import of app.js and
     crumbs.js, so the shell is broken without it. The hub and the
     practice book are precached too: the book is the page a
     learner opens every evening, and a bus with no signal is
     exactly where they open it.

     Only Stufe 1's book, though, and that is a decision rather
     than an oversight. There are three now, of thirty, sixty and
     ninety days, and every day of every one of them ships as
     static HTML: together they are about 1.8 MB. Precaching all
     three would put a megabyte and a half on the very first visit
     of a reader who may never open Stufe 2. The other two are
     picked up by the runtime cache the first evening they are
     opened, which is the evening before the bus.
     (Keep double quotes out of this comment: check-sw.mjs reads
     the list below by pulling quoted strings out of the block.) */
  "/deutsch/curriculum.js",
  "/deutsch/index.html",
  "/deutsch/hub.js",
  "/deutsch/progress.js",
  "/deutsch/icons.js",
  "/deutsch/stufe-1/index.html",
  "/deutsch/stufe-1/arbeitsbuch.html",
  "/deutsch/arbeitsbuch.js",
  /* The Quranic Arabic school, on exactly the German rule.
     curriculum.js is an import of content.js, so the shell is
     broken without it, and the hub is the page the ladder lives
     on. The sixty day pages are not listed: the runtime cache
     picks up the ones a reader actually opens, and dars.js is the
     script every one of them loads, so it is worth having early. */
  "/quran/curriculum.js",
  "/quran/index.html",
  "/quran/hub.js",
  "/quran/progress.js",
  "/quran/icons.js",
  "/quran/dars.js",
  "/quran/dhap.js",
  /* The English school, on exactly the same rule as the two
     above. curriculum.js is an import of content.js, so the shell
     is broken without it; the hub is the page the ladder lives
     on; part.js is the script every one of the thirty part pages
     loads. The part pages themselves and the workbook are left to
     the runtime cache: the workbook alone is a third of a
     megabyte of static days, and a reader who never opens it
     should not pay for it on their first visit. */
  "/english/curriculum.js",
  "/english/index.html",
  "/english/hub.js",
  "/english/progress.js",
  "/english/icons.js",
  "/english/part.js",
  "/english/term.js",
  /* The kitchen. Two pages and one module, so all of it is
     precached: this is the part of the site most likely to be
     opened in a kitchen with one bar of signal. */
  "/cooking/index.html",
  "/cooking/onions.html",
  "/travel/index.html",
  "/travel/uk-visit-visa.html",
  "/reads.js",
  "/tools/index.html",
  "/tools/stock.html",
  "/tools/stock.js",
  "/tools/stock.model.js",
  "/tools/stock.i18n.js",
  "/insights.html",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL)
      .then((cache) => cache.addAll(PRECACHE))
      // one missing file shouldn't stop the whole worker installing
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== SHELL && k !== RUNTIME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

const isHTML = (request) =>
  request.mode === "navigate" ||
  (request.headers.get("accept") ?? "").includes("text/html");

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Never cache another origin, and never cache the news feed:
  // stale headlines are worse than no headlines.
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (isHTML(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME).then((c) => c.put(request, copy));
          return response;
        })
        .catch(async () =>
          (await caches.match(request)) ??
          (await caches.match("/offline.html")) ??
          new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } })
        )
    );
    return;
  }

  /* Everything else: serve what we have, refresh in the background.

     RUNTIME IS CHECKED FIRST, AND THAT ORDER IS THE WHOLE POINT.
     A bare caches.match(request) searches every cache in creation
     order, so the precached SHELL copy answers ahead of anything
     the background refresh has written, which means a precached
     file is frozen at whatever VERSION last installed it, and the
     revalidate half of stale-while-revalidate never reaches the
     reader. That is not a theory: styles.css and three stock check
     modules were pinned at v9 through three separate fixes.

     Looking in RUNTIME first makes the refresh mean something. The
     shell remains the fallback, which is all it was ever for: the
     first visit, and offline. */
  event.respondWith((async () => {
    const cached = (await caches.match(request, { cacheName: RUNTIME }))
      ?? (await caches.match(request, { cacheName: SHELL }));

    const network = fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(RUNTIME).then((c) => c.put(request, copy));
        }
        return response;
      })
      .catch(() => cached);

    return cached ?? network;
  })());
});
