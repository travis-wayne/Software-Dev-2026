See canonical copy in `landing.traviswayne.com/intern-tasks/INTERN-TASK-01-feedback-route.md` — mirrored here for TWE-Company records.

---

# Intern Task 01 — Build the `/feedback` Route

**Goal:** build a working feedback board at `/feedback` using ReUI Kanban, wired to a real email notification via Resend. This task is deliberately used to test two things at once: your ability to integrate a new component library, and your ability to keep it visually indistinguishable from the rest of the site. The second part is the actual point. Anyone can install a component and drop it on a page. Making it look like it was always part of this codebase is the skill being tested here.

Read this entire document before writing any code. Steps build on each other, and skipping ahead usually means redoing work.

---

## Part 0 — Study Before You Build

Before touching `/feedback`, go read these four things in the actual codebase. Don't skim them. You're not just looking at what they do, you're looking at the pattern — naming conventions, file structure, how metadata is set up, how the existing Resend integration is written.

1. `src/app/(website)/contact/page.tsx` and `src/app/(website)/contact/contact-form.tsx` — this is your reference for page structure, metadata setup, and form-handling pattern. Your `/feedback` route should feel like it was built by the same person who built `/contact`, not like a bolted-on separate project.
2. The existing `/api/contact` route — this is your reference for how this project talks to Resend. Your new `/api/feedback` route should follow the exact same shape: same validation approach (Zod), same error handling, same response format. Don't invent a new pattern when one already exists.
3. `src/components/ui/` — this directory has the project's existing shadcn primitives: Button, Dialog, Input, Textarea, Card, Badge, and others. These already match the site's Dark Institutional theme (colors, radius, fonts) because they pull from the same CSS variables defined in the global stylesheet. Any new component you install must be re-pointed to use these, not its own bundled versions.
4. The global CSS variables (--background, --foreground, --primary, --radius, etc.) referenced in components.json and the global stylesheet. If you ever find yourself writing a raw hex color or a hardcoded pixel radius, stop. That's the signal something isn't using the theme correctly.

If anything in the existing code confuses you, ask before proceeding, don't guess and move on.

---

## Part 1 — Install ReUI Kanban

ReUI is a component library built on top of shadcn/ui's own "copy and own" model — the code lands directly in your repo, same as every other component already in src/components/ui/. It is not part of base shadcn/ui, so it needs its own registry added first.

1. Add the ReUI registry to components.json:
```json
{
  "registries": {
    "@reui": "https://reui.io/r/{style}/{name}.json"
  }
}
```
2. This project uses shadcn's standard Radix UI primitives (check src/components/ui/dialog.tsx or accordion.tsx — if they import from @radix-ui/react-*, you're on Radix, not Base UI). ReUI Kanban ships in both flavors. Install the Radix UI version, to match everything else already in this project. Installing the Base UI version instead would mean two different headless primitive systems living in the same codebase, which is exactly the kind of inconsistency this task is testing for.
3. Install via the shadcn CLI:
```bash
pnpm dlx shadcn@latest add @reui/kanban
```
4. This will land in something like src/components/reui/kanban.tsx. Read through the installed file before using it. Know what Kanban, KanbanBoard, KanbanColumn, KanbanColumnContent, KanbanItem, KanbanItemHandle, and KanbanOverlay each actually do before wiring them up blind.

Checkpoint: can you explain, in your own words, what each of those six components is responsible for? If not, re-read the installed source before moving on.

---

## Part 2 — Set Up the Route

Create src/app/(website)/feedback/page.tsx. Structure it the same way contact/page.tsx is structured: metadata export, page component, consistent use of the site's existing layout wrappers.

The page needs:
- A short intro section explaining what this board is (visitors can see what's suggested, planned, in progress, and shipped, and submit their own feedback)
- The Kanban board itself
- A way to submit new feedback (Part 4)

Columns for the board: Suggested, Planned, In Progress, Shipped. This mirrors how most real product feedback boards are structured, and "Shipped" gives a natural future connection to the existing /changelog page, worth keeping in mind even if you don't wire that connection today.

---

## Part 3 — Build the Board (This Is the Real Test)

ReUI's own example code composes the Kanban primitives with Card, Badge, Avatar, and Button — but it imports its own example versions of those. Do not use ReUI's bundled versions of components this project already has. Import Card, Badge, and Button from @/components/ui/*, the same way every other page in this codebase does.

This matters because ReUI's examples ship with their own default styling assumptions. If you leave those defaults in place, the board will visually clash with the rest of the site, slightly different radius, different shadow, different hover states, even if the colors happen to line up. The board needs to look like it was designed alongside the Bento Grid, the Services accordion, and everything else, not like a plugin sitting on top of the page.

Data for now: the board's state is plain React state (useState), exactly like ReUI's own docs describe it. There's no database in this project. Seed the board with 2 to 3 example feedback cards per column so the drag-and-drop functionality is visibly demonstrable when the page loads, rather than showing an empty board with nothing to interact with.

Self-check before moving on:
- Does every card, column header, and button use the project's existing components, not ReUI's own?
- Does the board look correct in both light and dark mode? (Toggle the theme switcher and check — this project has real light/dark support, and it's an easy thing to forget to test.)
- Are there any hardcoded colors anywhere in what you wrote? Search your new files for raw hex values. There shouldn't be any.

---

## Part 4 — Submit Feedback Form

Add a "Submit Feedback" button (using the project's existing Button component) that opens a Dialog (again, the project's existing one from src/components/ui/dialog.tsx, not a new one).

The form needs:
- Title (short text input)
- Description (textarea)
- Category, optional (could map to a suggested column, but doesn't need to auto-place the card on the board for this version, since there's no backend to persist it there anyway)

Validate with Zod, the same way contact-form.tsx does. Look at that file's validation schema as your template, don't write a new pattern from scratch.

Important distinction to understand: submitting this form does not need to add a card to the visible board. The board's seed data is a static demo. What the form actually does is send an email (Part 5). This is a deliberate design decision, not a shortcut, because there's no database in this project to persist real submissions into the board yet. Adding that would be a much bigger task than this one. If you're unsure why this is separated the way it is, ask before assuming it's a mistake in these instructions.

---

## Part 5 — Wire It to Resend

Create src/app/api/feedback/route.ts, following the same structure as the existing /api/contact route exactly: same Zod validation approach on the server side (never trust client-side validation alone), same Resend call shape, same success/error response pattern.

Read this part carefully before writing any code, this is the part that will silently fail if you get it wrong:

Resend's onboarding@resend.dev sandbox sender only works if the domain isn't verified yet, which is the current state of this project. In sandbox mode, Resend will only actually deliver an email to the address that the Resend account itself was signed up with. It does not matter what address your code puts in the to field, if it isn't that exact address, the API will return a 403 error.

The Resend account for this project was signed up with traviswayneenterprise@gmail.com. That means, right now, while there's no verified domain:

- from should be onboarding@resend.dev (or whatever sender the existing /api/contact route already uses, check it and match it)
- to must be traviswayneenterprise@gmail.com for the email to actually arrive, during this testing phase

The real long-term destination for feedback submissions is ent.traviswayne@gmail.com, but that address cannot receive anything until a real domain is verified in Resend. Don't hardcode either address directly in the route file. Add an environment variable, something like FEEDBACK_TO_EMAIL, set it to traviswayneenterprise@gmail.com in .env for now, and leave a comment above it explaining that this needs to change to ent.traviswayne@gmail.com once a domain is verified. This makes the eventual switch a one-line change instead of a code change.

Why this matters beyond just this task: this is a real, common pattern with third-party APIs. A service behaving differently in sandbox/test mode than it will in production is something you'll run into constantly. The lesson here isn't "remember this one Resend quirk," it's "always check what a service's test/sandbox mode actually restricts before assuming your code is broken when an API call fails."

---

## Part 6 — Test It End to End

1. Submit the feedback form with real test data.
2. Confirm the email actually arrives at traviswayneenterprise@gmail.com.
3. Confirm the board still renders and drag-and-drop still works after your changes.
4. Run pnpm lint && pnpm typecheck && pnpm build and make sure all three pass clean.

---

## Part 7 — Self-Review Checklist

Go through this list honestly before saying the task is done. This is the part that actually tests whether you understand "consistent UI shaping," not just whether the feature technically works.

- [ ] Every button, card, badge, and dialog on this page comes from @/components/ui/*, not ReUI's bundled defaults
- [ ] No hardcoded hex colors, no hardcoded border-radius values, anywhere in your new files
- [ ] The page looks correct in both light and dark mode
- [ ] The page follows the same metadata/SEO pattern as /contact
- [ ] The /api/feedback route follows the same validation and error-handling shape as /api/contact
- [ ] The feedback recipient email is an environment variable, not hardcoded, with a comment explaining the domain-verification limitation
- [ ] pnpm lint && pnpm typecheck && pnpm build all pass
- [ ] You can explain, out loud, without looking at this document, why the email currently goes to traviswayneenterprise@gmail.com and not ent.traviswayne@gmail.com

If you can't check every box honestly, the task isn't done yet, even if the page technically renders and the button technically works.
