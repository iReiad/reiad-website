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

   v182: /tools/stock.i18n.js. The other five calculators' words
        moved into it, 68 phrases, and they are in Bangla for the
        first time: their verdicts were template literals inside
        the module that drew them, so translating one meant
        editing code. Their arithmetic is `shared/calculators.ts`
        now and /tools/tools.js is the drawing only, which is what
        lets the Android app share the model rather than copy it.

   v181: /tools/stock.i18n.js. The stock check's 366 phrases moved
        to `shared/tool-strings.ts` and that file is now the
        compiled output of it, so the bytes changed although not
        one string did: tsc reformats the object. The move is
        what lets `/api/tools` serve the same table to the
        Android app, so an edited Bangla sentence reaches a phone
        with no app release.

   v180: /fallback.css. The diet pages had `main section`'s own
        top padding on top of a grid gap already spacing them,
        which measured about 130px of nothing between a lede and
        the first table. The grid owns the rhythm on those five.

   v179: /fallback.css. The diet tool became a tool: a board of
        widgets beside a log that saves to the account, a chart
        with a table under it and its axis labelled, and five
        more routes. The board's own rule is that every widget is
        legible with no data and every widget is a link, because
        a board of empty panels reads exactly like a broken page.

   v178: /fallback.css. THE FLARE, for real this time. A pane and
        a groove never held still: the pane's stillness was
        written on `[data-glow="pane"]` and the material is
        applied by CLASS, so it reached almost nothing, and the
        groove still said `--glow-w: 0px`, which the derived size
        formula overrides at equal specificity. Measured on the
        live stylesheet: `.rail` 220px, `.topbar` 220px,
        `.audience-switch` 73.6px, all now 0. The plate was fixed
        in v174 and these two were missed. check-material's ninth
        question is what asks.

   v177: /fallback.css. The diet tool's readout dropped a column
        in Bangla and not in English: Bangla's leading is 1.9, the
        page grew a scrollbar, and the wrap came in by enough to
        lose a 15rem track. A layout that reflows on a language
        switch is a layout tuned to one language. The pages also
        pad themselves clear of the floating bar now, measured
        against the routine's 68px where these had 10.

   v176: /fallback.css. The diet tool's own layer, which draws
        each phrase twice and lets the stylesheet show one: both
        languages are in the markup because a component that
        picked one in the browser would render English on the
        server and Bangla on the client, and React discards the
        difference. `data-tool-lang` on the root is what chooses,
        set before the first paint from the key the calculators
        have always used.

   v175: /fallback.css. The paper weave was painted twice: a
        ground carries it and so did every row and control drawn
        on that ground, two identical 45-degree gratings at a 5px
        pitch offset by each element's own origin, which stacks
        into dirt rather than cloth. Only paper showed it, because
        it is the one finish whose grain is a hatch. Measured:
        rail 2 weave layers, rail-item 2 more; now 2 and 0.

   v174: /fallback.css. The light stops following the pointer on
        a pane, and starts holding still on a plate, which it was
        already documented to do and never did: a `--glow-w: 0`
        beside each of their depths was overridden by the derived
        size formula later in the same layer, at equal
        specificity. A `.stat` measured 156px of moving light.
        One factor, `--follows`, decides it now.

   v173: /fallback.css. Two alignments that were guesses became
        sums: the tick on a checklist item and the numeral beside
        a practice book's writing box were both positioned
        against the top of a line BOX rather than against the
        letters in it, which is 1.9px out in English and further
        in Bangla, where the leading is 1.9 rather than 1.7. The
        writing boxes are ruled now, at exactly one line, which is
        what a practice book is.

   v172: comments only, in app.js and audience.js, and the bump
        is what stops them being served stale for ever. The one
        table the menu comes from moved from next/lib to
        shared/nav.ts, because four runtimes read it and next/
        was three of them. Both modules name that file in prose,
        check-pointers fails on a pointer that reaches nothing,
        so both had to be re-emitted. No behaviour changed.

   v171: this file. The fetch handler excluded cross-origin and
        /api/ and nothing else, so a React Server Component
        payload, which Next requests at the route's own address
        with `_rsc` on it, fell into the cache-first branch and
        was served from the cache for every later navigation.
        /admin drew its heading and its two credential cards out
        of the current build and nothing else, for days, while
        the HTML, the chunks and the stylesheet on the server
        were all correct and every check said so. A payload is
        never cached now, and neither is /admin in any form.

   v170: no file changed, and the bump is the fix.

        The runtime cache kept EVERY answer `fetch` resolved
        with, and it resolves for a 500 and a 404 as readily as
        for a 200: only a network failure rejects. So when two
        Workers rolled out a minute apart on 21 August 2026 and
        half a dozen pages answered 500 while they did, every
        reader who loaded one had that error page stored, and the
        next time their network failed the worker handed it back
        instead of offline.html. A cached error outlives the
        minute that caused it.

        `response.ok` is the condition now. The VERSION is what
        empties the caches already holding one, which is why this
        entry exists without a file beside it.

   v169: `/app.js`. The speculation rules excluded `/desk/*` from
        prerender-on-hover, because a hover is not a decision to
        open a private page. That address retired in v168 and the
        exclusion is `/admin` now. A cached `app.js` would go on
        building the admin panel, its two credential checks and
        thirteen panels' fetches, for somebody moving a pointer
        past the link in the Studio's bar.

   v168: `/fallback.css`. The desk retired to `archive/` and
        `/admin` answers all four spellings of its address, so
        every rule that styled only the desk went out of the
        stylesheet with it: the four overview tiles, the article
        rows, the More menu and the moderation rows. A precached
        copy of the old one is 150 lines of dead rules, which
        costs nothing until one of those class names is reused for
        something else.

   v167: `/fallback.css`. The pointer light is an ellipse rather
        than a circle, and the rail is the one surface that uses
        the second radius: a 220px circle on a column 268px wide
        reached four rows above the pointer and four below, which
        reads as a flare running the height of the rail rather
        than a light where the hand is.

   v166: `/account.js`. A comment in `aab/src/account.ts` named a
        hand-written declaration that went when that module
        converted, so the built file changed with it. Prose only,
        and it is precached prose: a returning browser holds the
        old copy of a served module until VERSION moves, whatever
        it was that changed inside it.

   v165: `/fallback.css`. Three material tokens stopped inheriting,
        which is what put a box round every row of the phone's
        drawer. The file changed in #181 and shipped under v164
        because `--update` recorded it rather than refusing it;
        `check-sw.ts` will not do that again.

   v164: `/fallback.css`. The bevel goes round all four sides at the
        glass's own thickness instead of a hairline, so depth reads
        from every side rather than only the bottom, and the routine
        dashboard's ten panels are surfaces at last.

   v163: `/fallback.css`. The edge is an inset shadow rather than a
        gradient, so it follows the border radius instead of cutting
        a straight chord across a rounded shape, and it opens as a
        surface lights. Every surface's own shadow moved to
        `--surface-shadow` so the material can own `box-shadow`
        without taking the hover lifts and focus rings with it.

   v162: `/fallback.css`. A sixth kind of glass, the groove, and
        forty-nine more classes on the material: every progress
        track, segmented control, article block, popover and
        toolbar that was sitting off it. The two pages served as
        files link the fallback stylesheet by name.

   v161: `/fallback.css`. The glass material: a flat top face, a
        hairline rim all the way round that splits into the
        section's accent, and thickness shown at the bottom cut
        edge rather than as a wash down the face. `--depth` is
        pixels now. The two pages served as files link the
        fallback stylesheet by name, so without this they keep
        the old material.

   v151: `/fallback.css`. The week on paper, which is the last
        piece of ROUTINE.md: blank for a pen, or filled in with
        the week just had.

   v150: `/fallback.css`. The year: twelve weeks, the mood
        ribbon under them, the jar, the birds, the garden, the
        six seasons and everything she has written.

   v149: `/fallback.css`. The routine's second surface, at
        `/tools/routine/settings`: the list, the templates and
        the copy.

   v148: `/fallback.css` and `/routine.js`. The routine's first
        page, `@layer routine` with it, and one new face:
        `Caveat`, loaded for exactly one thing, which is what a
        reader wrote themselves.

   v147: `/fallback.css`, and `/desk/app.js` and `/studio/app.js`
        with it. `<Button>` gained a `pressed` state and
        `.link-btn` gained the rule it had been promised and never
        given, so the two pages that are files and the two React
        bundles all carry it.

   v146: `/fallback.css`. The trail in the bar gained an arrow
        that opens what else is at that level, and the two pages
        that are files link the fallback stylesheet by name. A
        precached copy of the old one draws the new markup with
        no rule for it, which is an unstyled row rather than a
        missing one.

   v145: `/account.js`. `getProfile()` read `profiles` with no
        `id=eq.<me>` on it, and that is the one table whose select
        policy is `using (true)`, so PostgREST answered with
        whichever row it reached first out of the whole table. A
        precached copy of the old module would go on drawing a
        stranger's name, courses and pace as the reader's own, and
        go on losing every save, until this number moved.

   v144: `/offline.html`, and `/404.html` beside it, for a word.
        Both boot scripts tested `a === "money"` where the stored
        audience is `learn` or `work`, so a reader who chose
        Learning got no `data-audience` on the two pages that
        answer when the Worker and the routes cannot. The money
        school's move from /learn/ to /money/ took this comparison
        with it, which is the one thing that move was not supposed
        to touch. `check-next.ts` compares the three copies now.

   v143: most of the list, and for two reasons at once.

        Task #28 took `.html` off every address on the site, so
        every module that writes a link writes a different one:
        `/app.js`, `/pieces.js`, `/tools/stock.js`, the four
        `curriculum.js` and `/offline.html`.

        And task #24 converted the last of the hand-written
        browser modules to TypeScript, so `/streak.js`,
        `/audience.js`, `/activation.js` and `/tilt.js` are built
        from `aab/src/` now. Same addresses, same exports,
        different bytes.

        An old shell would serve a reader modules that link to
        addresses this deploy has redirected.

   v142: `/account.js`. `refreshUser()` could write a null user
        over a live session: an answer from `/auth/v1/user` with
        no id in it took `current()` to null, so `saveProfile`
        threw "Not signed in." and sync stopped pushing ticks with
        nothing on screen to say so. A refresh never downgrades
        now. An old shell keeps serving the version that does.

   v141: `/content.js`, `/photo.js` and `/schools/workbook.js`,
        and all three changed only in their comments: the last
        `.mjs` in this repository became `.ts`, and every comment
        naming one had to name the new file. A comment is bytes
        and a precached file is compared by bytes.

   v140: `/account.js`, `/signin.js`, `/account-page.js` and
        `/fallback.css`. The picture a Google sign-in brings comes
        through to the page now, and `account.js` is TypeScript:
        same address, same exports, one more field on the reader.
        An old shell serving the old three would draw the initial
        and never the photo.

   v139: `/fallback.css` and `/schools/hub.js`. `.ring` was a
        Tailwind utility as well as this site's progress ring, so
        every ring on the four school hubs wore a 1px square 44px
        across. It is `.progress-ring` now, in the stylesheet and
        in the markup, and both have to move together or the ring
        loses its stroke instead.

   v138: `/fallback.css` again, for the top bar. The mark was
        `flex: 1 1 auto` and grew to 490px of a 785px bar, so the
        trail showing where you are was squeezed into 44px against
        the tools. A logo does not grow.

   v137: `/news.js` and `/keep.js` leave this list, because both
        are gone. The research window on the About page and the
        Save and note under every byline are components, so an old
        shell would fetch two 404s on install and cache them. The
        About page's windows also opened on a title with nothing
        under it: the route port left every `<template data-detail>`
        empty, and an old app.js goes on drawing that.

   v136: the four ladders are `shared/curricula/*.ts` and the four
        `/<school>/curriculum.js` are generated from them. Same
        addresses, same exports, verified 58 of them against the
        originals with no difference, but different bytes, and an
        old shell holds the old copy of the biggest data on this
        site until this moves. `/content.js` changed with them,
        because it imports all four.

   v135: `/content.js` is generated from `shared/content.ts` now
        rather than hand-written, with the same 24 exports, and
        `/hub.js` and `/read-aloud.js` are gone: both are React
        components and an old shell would import two modules that
        are not served. `/desk/app.js` and `/studio/app.js` are a
        fresh build for the first time since #105, so a cached
        shell has been serving a desk from before `accentStyle`
        existed.

   v134: three things a cached shell would go on getting wrong.
        `/app.js` no longer imports `/crumbs.js`: the trail is
        rendered by the server into the top bar now, so an old
        app.js draws a second one under it and 404s on a module
        that is not served. `/fallback.css` is the whole stylesheet
        again and this time the glass in it actually blurs: every
        `backdrop-filter` was written with a hand-typed `-webkit-`
        twin, which is the one Chrome has never supported and the
        only one the build kept. And `/prefs.js` grew the three
        glass settings, so an old copy cannot apply a choice the
        account page can now make.

   v133: `/app.js` no longer imports `/engage.js`, and that import
        was counting every insights view TWICE: `initDynamic()`
        calls `countView()` for every page and then loaded a module
        whose top level called it again. Reactions and the question
        box are a component now. An old app.js would go on
        double-counting, and go on importing a module that is not
        served any more.

   v132: `/comments.js` is GONE from this list, which is the first
        precached module to leave rather than change. The thread
        under a piece is `next/components/comments.tsx` now, and a
        component is not a file with an address. A cached copy of
        the old one would be served to a returning reader forever
        and imported by nothing, which is a wasted 6 KB rather than
        a bug, but the entry has to go or this file precaches a
        404 and an install that fetches one caches it.

   v131: The checks are TypeScript too, all sixteen and the runner.
        `/share-card.js` and `/courses.js` changed only in a header
        comment: each named a check by a filename that does not
        exist, `scripts/check-modules.mjs` in one case having never
        existed under any extension.

        The types found a live one on the way. `check-next.ts`
        walked NAV reading `group.links` and `group.icon`, and a
        NavGroup has neither: it has `items`. So none of the rail's
        seventeen icons was ever checked, while the check printed a
        number and looked finished.

   v130: The generators are TypeScript. `/api.js`, `/photo.js` and
        `/share-card.js` changed only in a header comment naming
        the script that builds them, which is now
        `scripts/build-modules.ts`.

        Worth the bump anyway: a precached file that changed and
        did not get one is served stale forever, and "it was only
        a comment" is exactly the reasoning that would have to be
        right every time.

   v129: Stage B opens. Every module in aab/ read and classified in
        MIGRATION.md, and two things came out of it.

        `/contact-form.js` is gone: the form is
        `components/contact-form.tsx`, which renders the <form>
        around markup the route still writes, so with no JavaScript
        at all it still POSTs to Web3Forms on its own.

        `initArticleCards()` in `/app.js` filled `#article-cards`,
        and nothing has rendered that id since the hubs and the home
        page became routes. It took `piecesIn` and `filePieces` off
        `/pieces.js` with it. `allPieces()` stays: the palette is on
        every page and reads it.

   v128: Eight sections, one on screen. `/account.html` was one long
        page with a strip of links down it, and reaching the last
        of them was eight screens of scrolling.
        `components/ui/tab-panels.tsx` is the calculators'
        arrangement in React, and the strip is `.topbar` again: the
        same pill, the same glass, the same shadow, one gap below
        it. `/fallback.css` carries the rule.

   v127: The last four painters go. The four numbers, the year of
        days, the per-course cards and the three settings questions
        are `account/year.tsx`, `kept.tsx` and `settings.tsx`, and
        `/account-page.js` is 1155 lines down to 226: which half of
        the page shows, the exchange, take a copy, and leaving.

        `/sync.js` changed with it. `clearMirror()` fired the school
        events and not `sync:done`, so erasing an account, or a
        second person signing in on the same browser, left every
        React meter on the page showing the numbers that had just
        been taken away.

   v126: Where you are, and what you are aiming for, are components:
        `account/paths.tsx` and `account/targets.tsx`. The ladder
        each bar counts against comes down from the ROUTE now, out
        of `next/lib/school-ladders.ts`, so `/account-page.js` no
        longer imports all four schools' `curriculum.js` in the
        browser to find out what a denominator was: 150 KB of
        modules replaced by 20 KB of props, and the rule
        `next/lib/progress.ts` states restored.

        `/content.js` changed with it. `COURSES` held the money
        school TWICE, once written out by hand under a name it
        stopped using when it moved to `/money/` and once through
        `SKILLS`. Two checkboxes with one id, and a duplicate in
        the target form's menu.

   v125: The reading list and the notes are components too, one
        for both because `public.library` is one row per person
        per page with `saved` and `note` as two columns of it.

        `runtimeModule()` is how a component reaches a module this
        site serves at a path, and it hides the specifier from
        TWO bundlers rather than one: a "use client" component is
        built for the server render as well, and OpenNext bundles
        that copy with esbuild, which resolved what Turbopack had
        been told to leave. `next build` passed and the Cloudflare
        build did not.

   v124: Two sections of the account page are components. It is
        the one page whose whole body is built in the browser, by
        1,155 lines of `account-page.ts`, which is why nothing on
        it used a component. The reading preferences and the saved
        scenarios are `next/components/account/` now, and the
        module no longer paints them.

        They read `/prefs.js` and `/saved.js` at RUN time, which
        is the arrangement the Studio and the desk already use for
        seven modules: one copy of each, shared by every page,
        rather than a second that can drift. The types come from
        the declarations those two apps already had.

   v123: The stylesheet is Next's. `/styles.css` and
        `/tailwind.css` are not served any more: every route links
        a hashed stylesheet Next emits, which no service worker
        can precache by name and none needs to, because the
        runtime cache picks it up on the first visit.

        `404.html` and `offline.html` cannot link a hashed name
        and are the two pages that must answer when nothing else
        does, so they link `/fallback.css`, which is the same
        stylesheet with its comments removed and is precached in
        place of the two.

   v122: Seven rules that style nothing on this site are gone,
        and `check-css.ts` counts them now so no eighth arrives
        quietly. `.card-sub`, `.news-meta`, `.palette-panel`,
        `.pill-new`, `.section-more` and the two `-dot` variants
        of chart lines whose templates build `line-${k}` and
        `dot-${k}`, never `line-x-dot`.

        The count is a ratchet at zero rather than a wall, and its
        test is deliberately broad: half this site writes
        `className={plain ? "art" : "art stage-art"}`, and a
        pattern anchored to the quotes calls every one of those
        dead. A rule flagged and then deleted is a page losing its
        design.

   v120: Both practice books work. Neither did.

        `schools/workbook.js` is one engine where there were two
        388-line modules whose diff was nouns, and the English one
        keyed on a vocabulary the page does not have: it looked
        for `.wb-day` and `[data-wb-write]` where the component
        renders `.buch-tag` and `data-schrift`, so nothing saved,
        nothing revealed an answer and nothing ticked.

        The German one did not run at all. Both files opened with
        `document.getElementById("tage")` and dereferenced it on
        the next line, and the route that replaced the generated
        page had no element with that id, so the module threw
        before its first function ran. The route has the id now,
        and the day walker it also never rendered.

        `/schools/workbook.js` and `/english/workbook.js` join the
        precache: a cached caller whose import resolves to nothing
        is a book that comes back offline with none of what was
        written in it.

        And a day's tick is filed as `term-1/day-3` in English and
        `stufe-1/tag-3` in German. The engine built the German
        shape for both, so `toggleDay` wrote the English ticks
        correctly and the tracker looked for them under a name
        nothing had ever used: a day could be ticked and came back
        unticked. `dayId` comes from the school now, like every
        other key.

   v119: A text box is `@layer base` and `ui/field.tsx` adds
        nothing to it. The component carried its own box in
        utilities, and `tw` is a later layer than `base`, so the
        pages using it had `--radius-card` corners at `--t-3` over
        a flat panel while every other box on the site had
        `--radius-sm` corners at `--t-5` over glass. One
        definition, the one v112 made.

   v118: A button is one object. `ui/button.tsx` was Tailwind
        utilities, which made it a FIFTH way of making one rather
        than the one: `.btn-solid` in the stylesheet was `--accent`
        with an 80%-ink border, the component was `--accent-strong`
        with a transparent one, and a converted page grew visibly
        different buttons from the page beside it. Eighteen browser
        modules build `.btn .btn-ghost` nodes by hand, so a button
        has to mean one thing whichever half of the site made it.

        The stylesheet gained the two kinds it was missing and the
        on-accent set, so the component now writes class names and
        adds nothing. The on-accent set is a CLASS the caller opts
        into rather than a `.band .btn-ghost` descendant rule: that
        ties the ink to where a button sits, and it broke twice
        when a band changed its ground and the buttons did not
        follow.

   v117: The small line above a heading is two components, and
        they are two because they are two things: a
        `<SectionLabel>` closes with a rule, because it separates
        a section from the one before it, and an `<Eyebrow>` has
        nothing above it to separate from.

        The component that existed styled itself with utilities at
        `text-ink-soft`, with no rule and no margin, which is none
        of the three things `.section-label` does. So one school
        hub renderer drew a quiet grey label with no separator
        while the other drew an accent one with a rule, for the
        same heading on the same site.

   v116: `.cell` was one card doing five jobs and is gone from
        every route. Thirteen of them are `<GoCard>` or
        `<InfoCard>` now, which is the distinction the deck exists
        to make impossible to get wrong: one takes you somewhere
        and is an anchor, the other is the end of the road and is
        a div.

        `.cell-aim` went with them, and it is the reason to check
        rather than assume: it coloured `.tag` and `h3`, which is
        what a `.cell` was made of, and the deck renders
        `.card-chip` and `.card-title`. Moving that card across
        without moving the rule would have left an unreadable chip
        on an accent ground and nothing would have failed. It is
        `.card[data-fill]` and an `<InfoCard fill>`.

   v115: Fifty tiles are one component. Every figure across the
        seven case studies was the same four lines written out,
        and one rule here is now all fifty of them, which is what
        gave them the glass the rest of the site has.

        `ui/stat.tsx` renders the CLASSES rather than utilities,
        and its header says why at length: seven browser modules
        fill these in by `[data-tile="x"] .tile-value`, one of
        them builds a tile out of that markup, and `tw` is a later
        layer than `components`, so a utility on the value would
        have silently won over every tone a module sets. The page
        would render and the number would simply never be red.

   v114: A strip of choices is one object. The calculators' five
        tabs and the account page's eight section links were two
        looks: `.tool-tab` here, and twelve Tailwind arbitrary
        values written inline on the account page, naming `green`
        where every component on this site names `--accent`, at a
        font size that is not on the scale. `ui/tabs.tsx` is both,
        as two components rather than one with a role prop,
        because one HIDES what it is not showing and the other
        hides nothing.

        And two the top bar's flex row turned up. The button that
        closes the drawer kept its own copy of the burger's
        declarations and had one wrong, so the two were 42px and
        40px in the same place. Nothing in a flex row told the
        controls not to shrink.

   v113: The whole site from the top bar, as a tree. The rail is
        a column and a column has room for one level, so getting
        to Stufe 3 meant opening the German hub to find it. The
        bar carries every group, every destination and every
        school's stages, as a popover with no JavaScript in it.

        Two rules changed with it. `section` gave 68px of top
        padding to every section element on the site, including
        the five the tree is made of, which is why the panel was
        704px tall to hold 500px of menu: it is `main section`
        now, and every section this site renders is inside main.
        `.topbar` is a flex row rather than a three-column grid,
        because two of its children are display:none above 900px
        and an element that is not displayed is not a grid item.

   v112: A text box is one object now. Five blocks said what a
        field is, in five layers, with five paddings (12/14,
        10/12, 11/13, 10/12, 9/11), three backgrounds, two font
        sizes and two different ways of showing focus. Nothing was
        wrong with any of them and no two matched, so the Studio's
        text box, the contact form's and the stock check's were
        three different objects.

        One rule, on the ELEMENTS rather than a class, because
        half the fields on this site are written by a browser
        module or live in an app that does not import the
        component library. Glass ground, the sheen, a pane edge,
        `--tap` so a field lines up with the button beside it, and
        `--focus-ring` instead of an outline here and a shadow
        there. The five blocks keep only what differs: a width, a
        mono face for a number.

        `:is()` takes the specificity of its most specific
        argument, so a plain `textarea` rule after it lost and
        every textarea came out one line tall. The height is set
        per shape now.

   v111: Two alignments that were reported first and fixed last.

        The course breadcrumb sat against the window edge because
        `crumbs.js` mounts into `main > .wrap` and falls back to
        bare `main`, and the course shell has no wrap. It is
        `<Crumbs>` now, rendered by the route inside the same
        column `.course-shell` uses, so the two line up by
        construction rather than by being told the same number.

        `.btn` did not use `--tap`, the token whose own note says
        it is one height for anything you press. So `.btn` came out
        near 39px and `.tick-btn` near 37, and beside each other
        they were visibly off. Both are `--tap` now. `.tick-btn`
        also carried `margin-block: 28px 6px` for the one school
        lesson it was written for and took it everywhere else,
        which pushed it down out of a centred row; that spacing
        belongs to the caller and is there now.

   v110: The four practice books stopped being files when they
        became routes, and nobody told the rest of the repository.
        2.2 MB of generated HTML sat in `aab/` shadowed, the two
        builders that wrote it (1,473 lines) built nothing,
        `wrangler.toml` still said "the four practice books are
        files still", and this list precached one of them.

        Deleting them showed what had really happened: 40 rules in
        the German and English layers were only alive because those
        dead files referenced them, including the whole `.wb-*`
        workbook vocabulary, which nothing has used since one
        component started rendering both books. Verified against
        the lesson prose as well as the markup before removal.

   v109: The site stops being square, and the textures exist.

        Tailwind owns the `--radius-*` namespace and so does this
        site, and `@theme` carried `--radius-sm: var(--radius-sm)`.
        `@theme` emits its keys into `:root`, so the browser saw a
        custom property defined as itself: a cycle, invalid at
        computed value time, and every `border-radius:
        var(--radius-sm)` on the site fell back to nothing. That is
        the square button, the square text box, the square stat
        tile and the square box drawn round the progress ring.
        Tailwind's own scale was also overriding `--radius-xs` and
        `--radius-lg` from `@layer base`. `--radius-*: initial`
        clears the namespace so `styles.css` is the only thing that
        says what a corner is.

        `--weave` and `--sheen` were named by the Tailwind theme
        and declared nowhere, so `bg-weave` and `bg-sheen` did
        nothing in all seven components that asked, and every
        surface was flat colour. Both exist now, plus `--grain`,
        and all three take the page's accent. `check-css.ts`
        reads the Tailwind source too, which is where it could not
        see any of this.

   v108: The three hand-written school hubs are components. They
        were an HTML string each inside `school-hubs.ts`, so the
        page around them was React and everything inside them was
        not: the explainer cards were `.cell`, which `<InfoCard>`
        replaced months ago, and the closing block was `.band`,
        which is `<Band>`. A change to a card reached every page
        except the three a learner opens first. The prose moved to
        `school-hub-content.ts` as data, lifted by a script and
        checked back word for word, so no Bangla was retyped.

   v107: The band is a component, and a button on it can be read.
        A ghost button inside `.band` kept its near-white panel
        fill and was given white text, so it was invisible on the
        dark band; `.band.soft` then turned the ground back to
        paper without undoing the white text, so it was invisible
        on the light one too. `<Band>` and `<Button onAccent>` are
        one prop instead of two rules that have to remember each
        other. The band, the footer and the aim cell follow the
        accent rather than a fixed green. The practice book's
        rules moved out of `@layer deutsch` into `@layer workbook`,
        which is why the English book was rendering unstyled. The
        page ground carries more of its section's colour, and the
        day chips are discs.

   v106: A selected quiz answer highlights. Both rules that drew
        it said `var(--ground)`, which is not a token this
        stylesheet defines: an undefined custom property makes the
        whole declaration invalid at computed value time, so
        picking an answer did nothing visible. `--header-h` was
        the same, left behind when `body > header` was removed.
        `check-css.ts` now fails on a token nothing defines and
        no script sets.

   v105: The theming actually reaches the page. `--accent` was set
        correctly on every page and then ignored by 557 rules that
        named `var(--green)` or `var(--gold)`, so a German page
        carried a blue accent on <html> and drew a green button, a
        green section label and a gold eyebrow. They read
        `var(--accent)` now, and check-accents.ts fails on a rule
        that names one of the seven. Twenty golds stay, because
        they mean warn, risk and not-written-yet rather than a
        section. The corners are a five-rung ladder instead of
        thirty-three literals across fourteen values, and every
        rung is a step rounder: the site read as boxes. Rail rows
        are pills with a disc and glass on hover.

   v104: The surfaces compute again. `color-mix()` cannot contain
        `light-dark()`: the property does not compute at all, so
        every card's background came out at rgba(0,0,0,0) and the
        border shorthand was dropped with it, which is what "all
        things lost outlining" was. The per-mode values are two
        blocks now. A derived token is also re-derived where the
        accent is set, because one written on `:root` freezes the
        accent `:root` had, and a German card was computing a blue
        accent and a green panel at the same time. Hover was
        darkening a card below the page it sits on; check-surfaces
        is the new guard for all of it.

   v103: Five more components, so /tailwind.css carries the
        utilities they need: chip, stat tile, note, section label
        and meter. Each replaces a pattern the routes were writing
        out by hand between twenty and fifty times.

   v102: The theming got loud enough to see. The tint is a token
        per mode now, not one number: a light surface shows colour
        immediately and a dark one absorbs three times as much, so
        4% everywhere was visible in neither. Four rungs, page to
        edge, and three textures drawn in the accent so two
        surfaces at one lightness read as different materials.
        /tailwind.css grew the accent family and the textures as
        utilities, for the components that replace the old rules.

   v101: The German practice book is a route. /styles.css anchors
        37 of @layer deutsch's selectors with body.deutsch, which
        they always should have been: they were safe only while
        nothing outside aab/deutsch/ used those class names, and a
        shared component does.

   v100: Glass everywhere, and it follows the accent. --panel and
        --hairline are a mix now rather than flat colours, so all
        75 surfaces and all 269 borders carry a trace of the
        page's own colour without one of them being edited. The
        rail and the account popover gained the real backdrop
        blur the top bar already had.

   v99: A page wears the colour of its own icon in the rail.
        --accent arrives inline on <html> from the one table in
        shared/nav.ts, so /styles.css lost the five body rules
        that said five of the sixteen destinations by hand, and
        the practice books gained the attribute their school owns.

   v98: The breadcrumb stopped printing the site's name in it.
        /crumbs.js split the document title on U+2014, which this
        site's rules guarantee never appears, so the split did
        nothing and "Lesson · Reiad's Library" reached the crumb.
        It strips the site name now. /styles.css lost a doubled
        rule above the lesson buttons and gained overflow-wrap on
        prose, where a Bangla sentence running into an English one
        is one token to the line breaker and used to overflow.

   v97: /checkpoints.js and /sync.js rebuilt: _lib/sanitise and
        _lib/http became TypeScript and the modules that name them
        were repointed. No behaviour change.

   v96: Quiz answers reach the account. `courses-answers` was
        added to the BUILT /sync.js rather than to its source, so
        the next build silently dropped it and answers saved on
        one device and nowhere else. It is in aab/src/sync.ts now,
        and check-courses.ts fails if a key this section writes
        is one the account does not carry.

   v95: A quiz became something a reader can answer.
        Every option in a Coursera quiz lives inside a <form>,
        which the sanitiser drops whole, so the page showed the
        questions and none of the answers and looked finished.
        The Worker parses the file into questions now and the
        browser builds its own inputs, so /styles.css grew the
        fieldset, the option rows and the reset button they need.
        Captions landed in the same change and needed no CSS: a
        <track> is drawn by the player.

   v94: The course section stopped asking Drive for anything.
        Embedding a private Drive file was never going to work: a
        cross-site iframe gets no Drive cookie in a modern
        browser, so Drive answered "Unable to load video" and a
        reading was a button out to a viewer rather than a page.
        The Worker holds a Google credential now and streams the
        bytes from this origin, so /styles.css grew a real video
        element, the reading rendered in place, and the type it
        needs. The CSP swapped frame-src for media-src in the same
        change, which is a header rather than a precached file but
        belongs in the same sentence.

   v93: The third-party course section landed at /skills/courses/.
        /styles.css grew `@layer courses`, the two-column shape
        and the rail that section draws, and /sync.js grew two
        keys, `courses-read` and `courses-last`, so a tick made
        on a laptop reaches the phone. A visitor holding the v92
        copy of sync.js would go on ticking lessons that never
        left the browser, which is the silent half of this bump
        and the reason it is not optional.

        /courses.js is NOT in PRECACHE, on the same grounds as
        /tools/live.js at v90: it is useless without the network,
        because everything it draws comes from /api/courses and
        every video it plays comes from Drive. Precaching it would
        put an admin-only module on every visitor's disk to do
        nothing.

   v92: The front door became a deck, and every button became a
        pill. /styles.css: the door's one-screen layout gave way
        to a deck of accent-washed tiles that grows downwards,
        the deck's GoCards lost their hover lift, and /tilt.js
        now leans every clickable card on the site, the deck and
        the door included, which is why both lost the competing
        translate. /tailwind.css grew the utilities the new home
        markup wears. The buttons: one pill shape sitewide, with
        a focus ring and a press. And the live portfolio's
        holdings table was setting its whole column's width (a
        grid item's min-width is auto), pushing the stat tiles
        off the page edge; it scrolls inside its own box now.

   v91: The footer, which said the same thing twice and was
        half again as tall as it needed to be.

        A green band under the links promised, in both languages,
        that everything is free, that there is no login, and that
        what you have read stays in your own browser. All three
        of those are in the page's own note a hundred pixels
        below it: the German school's reads "free, in Bangla, and
        without a login. Your progress stays in your own browser."
        On /skills/ the page said it a third time in a band
        directly above the footer. One sentence of the band
        survives, the only part not said anywhere else, that an
        account carries progress between devices.

        The links were a ragged block. Learning has eight of them
        and the other four groups have one, two, three and one,
        so an `auto-fit` grid put the short ones in a row of
        their own and let Learning start a second row and set the
        height by itself. Learning takes the whole row now and
        stands its list on the nav's own tracks with `subgrid`,
        so the eight links and the four headings under them share
        four columns exactly rather than nearly.

        744px to 397px at 965 wide, 550 to 374 at 1440, 982 to
        681 on a 390px phone.

   v90: The live portfolio landed at /tools/live.html. /styles.css
        gained its drawing vocabulary in the tools layer, and
        /comments.js learned that an admin's comment comes back
        already live and redraws the thread instead of promising
        a wait. The page itself is Worker-rendered and not
        precached; its module /tools/live.js is new and useless
        offline (a live feed has nothing honest to say from a
        cache), so it is deliberately not in PRECACHE either.
   v89: The menu on a phone. /styles.css only, and three things
        in it that a reader can point at.

        The button that closes the drawer was a 34px circle in
        the drawer's far corner, 233px from the burger that had
        just been pressed. Opening a menu and closing it are one
        gesture and the control should not move, so the close
        button is the burger's shape laid out on the burger's
        exact pixels: [19, 18, 42x36] at every phone width. Both
        derive from `--bar-inset` rather than from a number typed
        twice, and the drawer's whole column is built from it too.

        `.audience-switch` carried `grid-column: 2`, which is
        correct in the top bar and wrong in the drawer, and that
        component is deliberately rendered in both. In the drawer
        it grew an implicit second column and sat in it, so "What
        brings you here" and the switch went side by side in a
        275px drawer and the label was clipped to "What brings
        yo". Placement belongs to the container now.

        And the site's name was on screen twice with the menu
        open, once in the bar and once in the drawer's head. The
        bar's copy is the one that stays, because it is there in
        the state a reader is in nearly all of the time.

        A stale v88 stylesheet under this markup is a drawer whose
        head is empty and whose close button is nowhere, which is
        why this needs the bump.

   v88: Seven colours, one design system. /styles.css gained a
        palette built out of seven hues at matched lightness, a
        spacing and type scale, and a top bar that is its own
        floating surface rather than a strip stuck to the page.
        Only the stylesheet changed in this list, but it is the
        one file every page waits for, and a reader holding the
        v87 copy would get the old bar under the new markup.

        The palette is measured now rather than believed:
        scripts/check-contrast.ts reads the tokens out of this
        stylesheet, converts OKLCH to a WCAG luminance and fails
        on any pair below the threshold for the size it is used
        at. That is what moved gold: at hue 85 it measured
        4.59:1 on the page, which passes and only just, and at
        hue 75 and a darker lightness it measures 7.11:1.

        About 500 lines left the stylesheet with it, all of them
        rules for markup nothing renders any more: the old home
        page's bento, the welcome-back band, the starter guide's
        eight accordion steps, the hand-written contents page and
        the runtime-built skills index. Every one of those pages
        is a route now.

        /tools/stock.js changed too. Its yield ladder was
        `.ladder`, which is also the money school's stack of
        stages and the account page's rows, in three different
        cascade layers; `check` comes last, so a bond ladder's
        spacing had been applied to every school ladder on the
        site. It is `.yield-*` now, and a reader holding the old
        copy of this file would get the renamed markup meeting
        the old class names.

        Two more things about the stylesheet, both of them the
        same idea as the contrast check. Every timing on the site
        is a token now: seventy-seven transitions already were,
        the six animations were not, so a page leaving was 160ms,
        a page arriving 260, a tilt 240 and three skeletons 1.3
        and 1.4s, none of them wrong alone and no two agreeing.
        And fifty distinct font sizes became nine, with the
        largest single change under a pixel, guarded by
        scripts/check-scale.ts.

        The one a reader will actually notice: `a:hover` faded
        every link on the site to 0.85 opacity, including whole
        cards, which reads as the card switching off. Nineteen
        rules wrote `opacity: 1` to undo it. Links hover on their
        underline now, which does nothing to a card because a
        card sets `text-decoration: none`, so there is nothing
        left to undo.

   v87: The same code, said better. Seven of the modules in this
        list are compiled from TypeScript now rather than written
        as JavaScript (archive/TRANSITION.md Stage 13), and
        /tailwind.css carries real utilities for the first time
        (Stage 14): the account page's markup is Tailwind and
        about 240 lines of rules left /styles.css with it.

        Nothing a reader can see is meant to have changed, which
        is exactly why this needs a bump rather than not needing
        one: every file involved is byte-different, a precached
        file is answered from the cache that holds it, and only a
        new VERSION empties that cache. /styles.css and
        /tailwind.css are the pair that must not be split, because
        one of them lost the rules the other gained.

   v86: What an account is actually for. Five things a reader
        gets for signing in, and two of them are new modules in
        this list. /keep.js is the Save and the note under the
        byline of every piece and every lesson, and /prefs.js is
        the type size, the measure, the theme and the language the
        calculators open in.

        /prefs.js is the one worth thinking about, because it is
        the first preference this site has that is not applied by
        the boot script alone. The script in the shell reads
        `reader-prefs` and sets two custom properties before the
        first paint; this module writes them and is what the
        account page's chips call. A v85 shell has neither, so
        both are new rather than changed, and a reader carrying
        the old one would get a preferences panel that does not
        load rather than a page at the wrong size, which is the
        right way round for a failure.

        /signin.js is a rewrite: the account panel was a modal
        dialog and is a `popover` menu now, so light dismiss,
        Escape and the focus return are the browser's rather than
        four listeners. /styles.css carries the rules it needs and
        changed with it, along with the account page's whole
        design, the top bar on a phone and the footer.
        /account-page.js and /sync.js changed with them, and
        /app.js gained one import: it pulls /prefs.js in for its
        side effect, so the six pages that are files rather than
        routes apply the reader's type size like every other page.
        All four are precached.

   v85: Progress belongs to the account. /sync.js is a rewrite: it
        no longer merges a browser with an account, it adopts the
        account's rows on to the device and never uploads what the
        browser held first, and it takes the mirror off again when
        the session ends. /first-sync.js is gone from this list
        and from the site, because the three-way question it asked
        was the old shape's and there is nothing left to ask. A
        cached v84 shell is the dangerous one here and is exactly
        why this bump matters: it would serve the OLD sync.js,
        which reads the same keys under the same names and pushes
        this browser's copy into the account behind the new
        rules' back.

        Two modules are new and both are precached. /saved.js is
        the account's scenarios and targets, imported at the top
        of /account-page.js and by /tools/stock.js, so a stale
        shell is an account page that does not load. And
        /checkpoints.js turns the checklist inside a lesson into
        ticks that are kept, which is the one of these a reader is
        most likely to want offline: /styles.css carries the rules
        it needs and changed with it.

        /styles.css also changed for the alignment pass, and
        /account-page.js, /tools/stock.js and /tools/stock.i18n.js
        are all precached and all changed.

   v84: The German, English and Quranic Arabic schools stopped
        keeping three copies of the same two modules. Their ticks
        are /schools/progress.js now and the drawings around their
        ladders are /schools/hub.js, so every one of the six files
        already in this list changed, and two new ones joined it.
        A cached v83 shell would answer /deutsch/hub.js from the
        cache with a copy that imports helpers it defines itself,
        which works, right up until the day one of them changes in
        the shared file and not in the stale copy. Bumping empties
        both.

   v83: The money school moved from /learn/ to /money/, which is
        251 addresses and every one of them 301s. Every precached
        path under the old mount is a new string: /money/reader.js
        (the modal term reader, which was /learn/learn.js and was
        never named for what it does), /money/curriculum.js and
        /money/icons.js. A cached v82 shell would keep serving the
        old three at addresses nothing answers any more, and the
        modal reader failing is the eighteen glossary terms
        navigating away instead of opening in place. /content.js,
        /crumbs.js, /audience.js and /app.js all changed with it.

   v82: The shell. The header bar, its overlay menu and its Skills
        hover panel are gone; the menu is a rail down the left of
        every page, rendered on the server. /styles.css gained two
        layers for it and for the card system, /app.js lost 550
        lines with the three things it no longer draws, and six
        modules left the precache list because the pages that
        loaded them are rendered from the database now:
        /recent.js, /home.js, /skills/skills.js, /money/hub.js,
        /money/progress.js and /money/contents.js. A cached v81
        app.js would import two of those and 404, taking the
        palette with it, so this bump is load-bearing rather than
        tidy. /content.js changed too: the money school is an
        entry in the skills list now.

   v81: Three fixes a reader can see. /styles.css locks scrolling
        on the root rather than on body, so the sticky header stays
        put while the menu is open instead of scrolling away with
        the one button that closes it. /app.js reads the theme a
        reader chose out of storage rather than off the element,
        which is what stopped a page turning itself dark a moment
        after it loaded.

   v80: archive/TRANSITION.md Stage 13. /photo.js is built from
        aab/src/photo.ts now. Same code, reindented by tsc, and a
        precached file that changed its bytes needs a bump even
        when it did not change its behaviour.

   v79: archive/TRANSITION.md Stage 13 and Stage 14. /api.js is built
        from aab/src/api.ts now, and /tailwind.css joins the
        precache list: a second stylesheet, built from
        aab/src/styles/, holding the theme tokens and whichever
        utilities a component actually uses. Nothing uses one yet,
        which is why it is 1.7 KB gzipped.

   v79 (Stage 13): /api.js is built from
        aab/src/api.ts now rather than written by hand, and tsc
        reindents what it emits, so the file is byte-different and
        line-for-line the same code. Checked rather than assumed:
        the two are identical once whitespace and comments are
        taken out.

        A bump for a file whose behaviour did not change is still
        a bump. A precached file is answered from the cache that
        holds it, and only a new VERSION empties that cache; a
        reader carrying the old bytes would carry them for ever,
        and the next real change to this file would then be
        invisible to them too.

   v78: archive/TRANSITION.md Stage 11.7. The four schools are Next.js
        routes and 247 committed pages have left aab/, six of them
        precached: both learn pages, the German hub and its first
        Stufe ladder, the Quranic Arabic hub and the English hub.

        They do NOT leave the shell, and that is the whole of the
        offline decision this stage had to take. A hub is the
        ladder and the ladder is how a reader finds their place;
        cache.addAll() performs real network fetches at install
        and does not care whether a Worker or a file answered
        them. So the six move to RENDERED below, which is
        precached exactly like PRECACHE and is not hashed, for the
        one reason a hash could never have covered: a rendered
        page changes when a row changes, and no VERSION could
        track that. Network-first is what handles a stale HTML
        copy and it handles these identically.

        The practice books stay files and stay in PRECACHE.
        Stufe 1s book is the page a learner opens every evening,
        on the bus, which is the case this whole list was written
        for.

        And install stops using cache.addAll. The comment under it
        has said for seventy-seven versions that one missing file
        should not stop the worker installing, and addAll is
        atomic: one failure rejected the lot and cached nothing.
        That mattered less when every entry was a file sitting
        beside the request than it does now that six depend on a
        Worker being up.

   v77: archive/TRANSITION.md Stage 11.5, finished. The home page and the
        eight portfolio pages are Next.js routes, so "/" and
        "/index.html" leave the precache list: they are the shell
        this list was named after, and a page a Worker builds
        cannot be precached at install.

        This is the one bump in the stage worth arguing with. A
        reader who opens the site offline now gets the offline
        page rather than the home page, where before they got a
        home page whose live parts were empty. The schools, which
        are what an offline reader is actually there for, are
        untouched and still precached in full, and the home page
        was never the thing being read on a train.

   v76: archive/TRANSITION.md Stage 11.4. The tools index and the stock
        check are Next.js routes, so both leave the precache list.
        Their scripts do not: /tools/stock.js, stock.model.js and
        stock.i18n.js are still precached, because the page is
        what a Worker now builds and the arithmetic behind it is
        still a file, unchanged, at the same address. A reader
        who has opened the stock check once keeps the maths
        offline and needs the network for the page around it.

   v75: archive/TRANSITION.md Stage 11.5 again. /account.html and
        /skills/index.html are Next.js routes now, so they leave
        the precache list: a page a Worker builds is cached the
        first time it is fetched rather than at install. The
        skills hub is the one worth thinking about, because it is
        the door to four schools and a reader offline on it now
        gets the offline page rather than a stale ladder. Its
        schools' own hubs are still precached and still the thing
        a returning learner opens.

   v74: archive/TRANSITION.md Stage 11.5, and the colophon is gone. Both
        precached files that changed are small: content.js lost
        the colophon's PAGES entry, so a returning reader on the
        v73 shell would have it in the menu and the Ctrl+K palette
        pointing at a 301; and audience.js listed /colophon among
        the pages that mean somebody is here for work.

        The colophon went rather than being ported. It was a page
        about how this site is built, and its own copy said "0
        build steps", "0 runtime dependencies, npm packages or
        frameworks" and "no framework, no templating, no
        generator". Every one of those stopped being true during
        stages 9 to 11. /about answers the question it was
        answering, and _redirects sends both of its addresses
        there.

        about.html and contact.html are Next.js routes now and are
        not in this list: neither ever was.

   v73: archive/TRANSITION.md Stage 11.2. The last two article files leave
        the precache list: /cooking/onions.html and
        /travel/uk-visit-visa.html are rows, rendered by the
        Next.js Worker at the same addresses, and a page a Worker
        builds cannot be precached at install. app.js, home.js,
        crumbs.js and content.js all changed with them and all
        four are precached. The one a returning reader would
        notice: home.js used to say how many pieces had been
        published by counting an array in content.js, and that
        array is empty now, so a v72 shell would draw a home page
        saying nothing has been written. styles.css lost
        `.attiyo` with them, the grid inside the onions piece: it
        is not in either sanitiser's allowlist, so it has not
        survived a publish since that piece became a row.

   v72: styles.css lost three rules with Stage 11.1, and it is
        precached. `.read-en`, `.read-note` and `.read-fallback`
        were the English sub-title on a Bangla card, the note on a
        placeholder and the no-JavaScript list inside the two hub
        pages. None of the three can be drawn any more: the first
        was only ever set from a content.js entry and is not a
        column, and the other two belonged to the markup the route
        replaced. check-css.ts is what found them, the moment the
        pages holding them left aab/.

   v71: archive/TRANSITION.md Stage 11.1. The three reading hubs are
        rendered by the Next.js Worker now, so /insights.html,
        /cooking/index.html and /travel/index.html leave the
        precache list along with /reads.js, which drew the two
        Bangla ones and has nothing left to draw. A page a Worker
        builds cannot be precached at install: it is cached the
        first time it is fetched, network-first like every other
        page of HTML here, so a reader who loses their connection
        having never opened a hub gets the offline page rather
        than a stale hub. That is the trade Stage 11 names, taken
        knowingly for three index pages and not for a lesson.

   v70: /insights.html changed, and it is precached. The subscribe
        box it carried as an inline module is a file now,
        /hub.js, so that this page and the Next.js route that
        replaces it (archive/TRANSITION.md Stage 11.1) run the same lines
        rather than two copies of them. A returning reader holding
        the v69 page would keep the inline copy, which still
        works; the reason for the bump is that the day the two
        stop agreeing is the day one of them is being edited.

   v69: /money/contents.html changed, and it is precached. The
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

   v67: archive/TRANSITION.md Stage 8. The Quran school's curriculum.js is
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
        runs recordVisit() from /money/progress.js on every page of
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
   reached nobody who had been to the site before. check-css.ts
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
   exactly the shape of the v3 and v10 mistakes, check-sw.ts caught
   each one before it shipped.

   v12: the About page was rebuilt, new markup, a new `about`
   cascade layer in styles.css and a small about.js that counts the
   library from content.js rather than trusting a typed number.

   v11: a UI pass, the modal reader prefetches and retries, the
   menu and palette were restructured, the home page gained a
   Bangla half and a models section, and the learn hub's doors
   became buttons. styles.css, app.js, content.js, learn.js,
   hub.js and three precached pages all changed. check-sw.ts
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
   instead of freezing a file forever. check-sw.ts guards the rest.

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
   progress.js) and the new /money/contents.html. A cached v4
   app.js would fail to resolve the new import.

   v4: the Learn area was restructured, app.js gained three new
   imports (crumbs, audience, learn progress) and the hub is a
   different page. Without a bump, a returning reader would be
   served the v3 app.js forever and none of it would appear. */
const VERSION = "v182";
const SHELL = `shell-${VERSION}`;
const RUNTIME = `runtime-${VERSION}`;

/* Worth having before it's needed, so the first offline visit works.

   app.js is an ES module and its imports are separate requests, so
   each one has to be listed: a cached app.js whose imports 404 is
   worse than no app.js at all. Lesson pages are deliberately NOT
   precached: there are seventy of them, and the runtime cache
   picks up the ones a reader actually opens. */
const PRECACHE = [
  "/offline.html",
  /* The stylesheet, for the two pages that are files.

     It was `/styles.css` and `/tailwind.css` here, and both are
     gone: the stylesheet is `next/styles/` now and Next emits it
     under a content hash, which a service worker cannot precache
     because it cannot know the name. Every route links the hashed
     one and the runtime cache picks it up on the first visit,
     which is what stale-while-revalidate is for.

     `404.html` and `offline.html` cannot link a hashed name, and
     they are exactly the pages that have to answer when nothing
     else does, so they link this: the same stylesheet with its
     comments taken out, written by `scripts/build-fallback.ts`.
     248 KB against the 416 they were loading. */
  "/fallback.css",
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
  "/account-page.js",
  /* app.js imports this one EAGERLY, at the top, unlike the three
     above: a shell without it is an app.js whose import 404s, and
     that takes the menu and the palette with it. */
  "/streak.js",
  /* studio.js and desk.js both import this, and a shell without it
     is an editor that cannot save a photo. */
  "/photo.js",
  /* Everything an account holds that is not a tick: saved
     scenarios, targets, and the library of kept pages and notes.
     account-page.js imports it at the top and the stock check
     imports it too, so a shell without it is an account page that
     does not load and a stock check with no Save button. */
  "/saved.js",
  /* How the reader wants to be read to. The boot script in the
     shell applies the same values before the first paint without
     this file, so a stale shell is a preferences panel that does
     not load rather than a page at the wrong size. */
  "/prefs.js",
  /* Every school lesson loads this, and a lesson body a reader
     has offline is exactly where a checklist they were working
     through is. Without it the ticks are gone and the list is
     back to being prose. */
  "/checkpoints.js",
  /* Loaded lazily by an article page. Precached so a thread still
     draws for somebody reading offline. */
  "/audience.js",
  "/activation.js",
  /* app.js imports this one directly, so a cached app.js without
     it is an app.js whose import 404s, which is worse than no
     app.js at all.

     Six names left this list in August 2026 and none of them is
     coming back: /recent.js, /home.js, /skills/skills.js,
     /money/hub.js, /money/progress.js and /money/contents.js.
     Each drew a page in the browser that the server draws now,
     and `archive/shell-2026/README.md` is the table of which is
     which. /money/reader.js stayed: it is the modal term reader,
     which is the one thing on those pages that really did need a
     browser. */
  "/tilt.js",
  "/money/reader.js",
  "/money/curriculum.js",
  "/money/icons.js",
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
     (Keep double quotes out of this comment: check-sw.ts reads
     the list below by pulling quoted strings out of the block.) */
  /* The two modules all three of the schools below now run on.
     progress.js is the ticks, the days and the bookmark, and
     hub.js is the ring, the resume card and the bar: one copy
     each, where there used to be three. A school hub is broken
     without them, so they are precached beside the schools
     rather than left to the runtime cache. */
  "/schools/progress.js",
  "/schools/hub.js",
  /* And the practice books' one engine. Both schools' book
     scripts are four lines over this, so precaching one of them
     without it is the `pieces.js` mistake in the paragraph above:
     an offline visit gets the caller from the cache and its
     import resolves to nothing, and the book that comes back is a
     printed one with none of what was written in it. */
  "/schools/workbook.js",
  "/deutsch/curriculum.js",
  "/deutsch/hub.js",
  "/deutsch/progress.js",
  "/deutsch/icons.js",
  /* The practice book is a route now, so there is no file to
     precache: the runtime cache picks the page up on the first
     visit like every other rendered page. `arbeitsbuch.js` stays,
     because the route still loads it and a book that cannot
     restore what was written is the offline visit going wrong in
     the one place a reader would notice. */
  "/deutsch/arbeitsbuch.js",
  /* The Quranic Arabic school, on exactly the German rule.
     curriculum.js is an import of content.js, so the shell is
     broken without it, and the hub is the page the ladder lives
     on. The sixty day pages are not listed: the runtime cache
     picks up the ones a reader actually opens, and dars.js is the
     script every one of them loads, so it is worth having early. */
  "/quran/curriculum.js",
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
  "/english/hub.js",
  "/english/progress.js",
  "/english/icons.js",
  "/english/part.js",
  "/english/term.js",
  /* Beside the German book's, and for the same reason. It was
     missing, which mattered less while it did not work: it keyed
     on a vocabulary the page has not had since the book became a
     route. */
  "/english/workbook.js",
  "/tools/stock.js",
  "/tools/stock.model.js",
  "/tools/stock.i18n.js",
  "/favicon.ico",
];

/* Addresses rather than files, precached the same way.

   archive/TRANSITION.md Stage 11.7. Every one of these is a page a Worker
   builds out of the database, so there is nothing in aab/ to hash
   and check-sw.ts does not try: it checks that each one is a
   route worker.js actually forwards, which is the failure that
   would matter here (an address in this list that nothing serves
   is an install that fetches a 404 and caches it).

   Why they are precached at all, when the home page stopped being
   at v77: these are the schools, and the schools are what an
   offline reader is there for. A hub is the ladder and the ladder
   is how somebody finds their place on a train. The 233 lesson
   pages are not here and never were: the runtime cache picks up
   the ones a reader actually opens, which is the same arrangement
   they had as files. */
const RENDERED = [
  "/money",
  "/money/contents",
  "/deutsch",
  "/deutsch/stufe-1",
  "/quran",
  "/english",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL)
      /* One at a time, and one failure costs that entry rather
         than the shell.

         This was cache.addAll() for seventy-seven versions, under
         a comment saying a missing file should not stop the
         worker installing. addAll is atomic: it rejects on the
         first failure and caches NOTHING, so the comment
         described what was wanted and the opposite happened. It
         mattered little while every entry was a file sitting
         beside the request; six of them are pages a Worker builds
         now, and one slow deploy would have emptied the whole
         offline shell. */
      .then((cache) => Promise.allSettled(
        [...PRECACHE, ...RENDERED].map((url) => cache.add(url))
      ))
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

  /* A React Server Component payload is not a file, and the
     branch at the bottom of this file treats everything that is
     not HTML as one.

     Next asks for one on every client-side navigation and every
     prefetch, at the route's own address with `_rsc` on it. It is
     THIS BUILD's description of THAT route, it varies on four
     router headers, and a prefetch payload is deliberately
     partial. Served cache-first, one captured under an earlier
     build answers a navigation under the next: the chrome and the
     heading come from the new bundle and the body comes from
     whatever the old payload held.

     /admin lost thirteen panels to this and every check passed,
     because the HTML, the chunks and the stylesheet really were
     correct. Reproducing it needed the page driven in a browser
     with no worker in the way, which is the one thing a check
     that reads files cannot do. */
  if (url.searchParams.has("_rsc")
      || request.headers.has("RSC")
      || request.headers.has("Next-Router-Prefetch")) return;

  /* And the admin panel is one person's. Nothing about it belongs
     in a cache that a later reader at the same machine is handed,
     which is the argument `sync.js` makes about ticks one level
     up. */
  if (url.pathname === "/admin") return;

  if (isHTML(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          /* Only a 200 is worth keeping, and this cached EVERY
             answer.

             `fetch` rejects on a network failure and on nothing
             else: a 500, a 404 and a 302 all RESOLVE, so all
             three were written into the runtime cache and served
             back later from the branch below. On 21 August 2026
             two Workers rolled out a minute apart and half a
             dozen pages answered 500 while they did; every reader
             who loaded one had that error page stored, and the
             next time their network failed the worker handed it
             back instead of offline.html. A cached error is worse
             than no cache, because it outlives the minute that
             caused it. */
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME).then((c) => c.put(request, copy));
          }
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
