# Lesson 47 Tutor Notes: Instructor & Mentorship Guide

## Session Overview & Mentorship Philosophy
Lesson 47 is the culmination of the Software-Dev-2026 curriculum. The goal of this capstone phase is not to hold the student's hand through a tutorial, but to act as a **Senior Engineering Manager** conducting architecture reviews.

When a student hits a roadblock, do not touch their keyboard. Do not give them the exact code snippet. Instead:
1. Ask them to trace the data flow (Where is the request starting? Where does it die?)
2. Ask them to check the Network Tab and Server Logs.
3. Prompt them to review their architectural assumptions.

Your goal is to foster extreme independence and system-level thinking.

---

## 90-Minute Capstone Workshop Timetable

- **00:00-00:15: Architecture Blueprint Review & Industry SaaS patterns**
  Review the "Request Lifecycle" and discuss how Linear and Shopify structure their data.
- **00:15-00:35: Live Technical Deep-Dive (Presigned S3 Uploads & NextAuth RBAC)**
  Walk through the code of generating a pre-signed URL. Explain why serverless memory limits make direct uploads critical.
- **00:35-01:05: Interactive Lab Exploration & Capstone Architecture Simulator**
  Have students open the `capstone-simulator-lab/index.html`. Walk through the 4 tabs, especially the "Chaos Engine" debugging scenarios.
- **01:05-01:20: Project Scoping & Sprint Planning Workshop**
  Students choose one of the 3 blueprints from the project guide (DevPulse, ProStack, OmniMart) and break it down into realistic 1-week sprints using Kanban boards.
- **01:20-01:30: Rubric Review, Q&A, and Graduation Launch!**
  Go over the grading rubric and set clear expectations for the final presentations.

---

## Production War Stories (3 Real-World Case Studies)

Share these stories to illustrate *why* architectural decisions matter.

### 1. The Serverless Memory Crash (The S3 Upload Mistake)
**The Scenario**: An ed-tech startup built a video assignment platform. They used a Next.js API route to handle `multipart/form-data` uploads, streaming files to S3 via their Vercel Node backend.
**The Disaster**: During midterm submissions, 500 students uploaded 50MB videos simultaneously. The serverless functions, limited to 1024MB of memory and a 10-second timeout, ran out of memory and timed out. The entire API cluster cascaded into 502 Bad Gateway errors, taking the site down for hours.
**The Fix**: Refactoring to the AWS S3 Pre-signed URL pattern. The server only generates a tiny string (the URL) and returns it in 40ms. The heavy lifting of the 50MB upload is handled directly between the client's browser and AWS infrastructure.

### 2. The N+1 Query Disaster on Launch Day
**The Scenario**: A social network clone launched on Product Hunt. The home feed rendered 50 posts. For every single post rendered in the React tree, a child `<AuthorCard>` component made a separate `fetch('/api/user')` call to get the author's avatar.
**The Disaster**: Loading the homepage triggered 1 query for posts + 50 queries for authors = 51 queries per user. With 1,000 visitors, the Neon Postgres database received 51,000 queries instantly, exhausting the connection pool and locking up the database within 3 minutes.
**The Fix**: Implementing Prisma `include: { author: true }` (SQL JOIN) in the initial post fetch. One single query returned all the data, dropping response times from 3,400ms to 45ms.

### 3. The Token Leak in the Client Bundle
**The Scenario**: A junior developer wanted to upload an image from the frontend React component. They needed their AWS keys, so they added `NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=...` to their `.env` file.
**The Disaster**: The `NEXT_PUBLIC_` prefix instructs Webpack to bundle the secret directly into the minified Javascript file sent to the browser. A GitHub security scanner detected the key in production within 10 minutes, but automated botnets had already spun up $4,000 worth of crypto-mining EC2 instances in the AWS account.
**The Lesson**: Strict hygiene around environment variables. Secrets must stay on the server.

---

## Capstone Grading & Evaluation Rubric

Evaluate student projects across these four dimensions:

### 1. Architecture & Code Organization
- **Needs Improvement**: All logic stuffed into large page files; heavy prop drilling; redundant code.
- **Proficient**: Clean component separation; use of Context/Zustand; API routes follow RESTful conventions.
- **Enterprise-Grade**: Distinct layers (Services, Controllers, UI); elegant custom hooks; strict Zod validation at all boundaries.

### 2. Database Design & Optimization
- **Needs Improvement**: Flat data structures; N+1 queries everywhere; missing indexes.
- **Proficient**: Proper 1:N and M:N Prisma relations; efficient querying.
- **Enterprise-Grade**: Optimized SQL operations; cursor-based pagination; usage of caching (Redis) for heavy reads.

### 3. Security & Authentication
- **Needs Improvement**: Plaintext passwords (if custom); broken route protection.
- **Proficient**: NextAuth implemented correctly; API routes check for valid sessions.
- **Enterprise-Grade**: Complex RBAC (Role-Based Access Control) enforced at both UI and server middleware levels; no secrets leaked to client.

### 4. UI/UX & Responsive Design
- **Needs Improvement**: Broken mobile views; confusing navigation; lacks loading states.
- **Proficient**: Clean design; works on mobile; uses loaders/spinners for async operations.
- **Enterprise-Grade**: Optimistic UI updates; stunning visual feedback; polished micro-interactions; zero layout shift.

---

## Comprehension Q&A & Interview Probes

Test your students' knowledge during their final presentations with these probes:

**Q1: "I see your app feels very fast when creating a post. Are you using Optimistic UI? How does that handle server failures?"**
*Answer*: The student should explain that Zustand/React Query updates the UI immediately. If the background network request fails, they must have logic to roll back the UI state and show an error toast to prevent data desynchronization.

**Q2: "Explain the difference between `DATABASE_URL` and `DIRECT_URL` in your Prisma setup."**
*Answer*: `DATABASE_URL` connects through a pooler (like PgBouncer) to multiplex connections and prevent serverless connection exhaustion. `DIRECT_URL` is a persistent connection required for schema migrations (`prisma db push`), which cannot run through a pooler.

**Q3: "If I wanted to add a 'Pro' tier subscription to your app, how would you model that in the database and handle the Stripe webhooks?"**
*Answer*: Add a `stripeCustomerId` and `subscriptionStatus` to the User model. Expose an endpoint `/api/webhooks/stripe`. Most importantly, mention **verifying the Stripe signature** to prevent malicious actors from faking payment success requests, and using **idempotency keys**.

**Q4: "Where did you decide to use Zustand versus TanStack Query, and why?"**
*Answer*: Zustand for synchronous UI state (sidebar open, theme, active tab). TanStack query for asynchronous server state (fetching users, caching, stale-while-revalidate).

**Q5: "How are you ensuring that User A cannot delete User B's workspace?"**
*Answer*: It is not enough to hide the "Delete" button in the UI. The API route (`DELETE /api/workspaces/:id`) must verify the session token, lookup the workspace, and confirm the `userId` attached to the JWT matches the `ownerId` of the workspace.
