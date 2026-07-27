# Exercise Workbook: Career Action Plan

Complete these 4 exercises to finalize your professional developer brand and prepare for the interview gauntlet!

---

## Exercise 1: The ATS Resume Audit & XYZ Transformation

**Task:** Rewrite the following 5 weak, passive resume bullet points using the Google XYZ formula: *"Accomplished [X], measured by [Y], by doing [Z]"*. Include specific technical keywords (Next.js, Prisma, Redis, Docker, CI/CD) and invent realistic metrics to make them shine.

1. **Weak:** "Built a backend server that handles user logins."
   **Your Rewrite:** _________________________________________________________________________

2. **Weak:** "Used React to make a dashboard look nice."
   **Your Rewrite:** _________________________________________________________________________

3. **Weak:** "Deployed my code to the cloud."
   **Your Rewrite:** _________________________________________________________________________

4. **Weak:** "Fixed a slow database problem."
   **Your Rewrite:** _________________________________________________________________________

5. **Weak:** "Worked on an issue tracker app for a school project."
   **Your Rewrite:** _________________________________________________________________________

---

## Exercise 2: The Project Case Study Storyboarder

**Task:** Fill out this template for your Lesson 47 Capstone project (or your best portfolio piece) to create a compelling technical case study for your portfolio and interviews.

**Project Name:** ___________________
**Live URL:** _______________________
**GitHub URL:** _____________________

1. **The Elevator Pitch (1-2 sentences):**
   *What is it and who is it for?*
   >

2. **The Core Architecture:**
   *Frontend, Backend, Database, Cloud/DevOps tools used.*
   >

3. **The Hardest Technical Bug Solved:**
   *What went wrong? How did you debug it? What was the fix?*
   >

4. **The Key Lesson Learned:**
   *If you had to build it again, what would you do differently?*
   >

---

## Exercise 3: High-Signal Cold Outreach & LinkedIn Scripts

**Task:** Customize these templates with your specific details. Save them in your notes for your job hunt!

### Template A: Cold Outreach to an Engineering Manager
> Hi [Manager Name],
>
> I recently built a [Your Project Type, e.g., scalable SaaS issue tracker] using [Target Company's Tech Stack, e.g., Next.js and PostgreSQL]. I've been following [Company Name]'s engineering blog, and I was really impressed by your team's work on [Specific Feature/Article].
>
> I'm currently looking for full-stack roles and would love to learn more about the engineering culture on your team. Do you have 10 minutes for a quick chat next week?
>
> Best,
> [Your Name]
> [Link to Portfolio/GitHub]

### Template B: Informational Interview Request to a Senior Engineer
> Hi [Engineer Name],
>
> I'm an early-career full-stack developer specializing in [Tech Stack]. I noticed you transitioned into a Senior role at [Company] a few years ago. I really admire your career trajectory and the work your team is doing with [Specific Technology].
>
> If you're open to it, I'd love to ask you 2-3 quick questions about your experience at [Company] over a brief 15-minute virtual coffee. No worries if you're too busy!
>
> Thanks,
> [Your Name]

### Template C: Follow-Up After Submitting an Application (To Recruiter)
> Hi [Recruiter Name],
>
> I recently submitted my application for the [Job Title] role at [Company]. Given the team's focus on [Company Goal/Tech Stack], I wanted to reach out directly.
>
> I recently architected a [Your Project] that handles [Metric/Feature], which aligns closely with the requirements for this position.
>
> I'd love the opportunity to discuss how my technical background can bring immediate value to the engineering team.
>
> Best regards,
> [Your Name]
> [Link to Portfolio]

---

## Exercise 4: The Mock Interview Self-Assessment Checklist

Before any technical interview, ensure you can check off every item on this list:

### Resume & Online Presence
- [ ] My resume is exactly 1 page.
- [ ] All bullet points use the XYZ impact formula.
- [ ] My GitHub profile is clean, with pinned repositories and professional READMEs.
- [ ] My LinkedIn headline highlights my tech stack and engineering focus.
- [ ] My portfolio features at least one deep architectural case study, not just tutorial clones.

### Behavioral Preparation (STAR)
- [ ] I have a STAR story prepared for a time I solved a complex technical bug.
- [ ] I have a STAR story prepared for a time I disagreed with a teammate.
- [ ] I have a STAR story prepared for a time I learned a new technology rapidly.
- [ ] I have a STAR story prepared for a time I failed or missed a deadline.
- [ ] Prepared 3 STAR anchor stories adaptable to multiple question types

### Technical & Logistics Setup
- [ ] I have practiced explaining my Capstone architecture out loud.
- [ ] I am comfortable explaining the trade-offs between SQL and NoSQL.
- [ ] I know how to explain what happens when you type "google.com" into a browser.
- [ ] My webcam, microphone, and internet connection are tested and reliable.
- [ ] I have a clean, distraction-free background for video calls.
- [ ] Practiced the "System Design in 5 Steps" framework with a URL shortener example
- [ ] Researched the target company's tech stack (read their engineering blog)
- [ ] Prepared 3 thoughtful questions to ask the interviewer (shows genuine interest!)

### Post-Interview
- [ ] Sent a thank-you email within 24 hours of the interview (only ~10% of candidates do this — it stands out!)

---

## 📋 Exercise 2 Reference Answer — ProStack SaaS Issue Tracker Case Study

### 🎣 The 30-Second Hook
I built ProStack — a multi-tenant SaaS issue tracker inspired by Linear. It handles real-time issue management with role-based access control, direct-to-S3 file attachments, and cursor-based infinite scroll optimized for 100,000+ issues.

### 🏗️ The Architecture Blueprint
- **Frontend:** Next.js 16 App Router with Server Components for SEO + React Client Components for interactive Kanban board
- **Backend:** Node.js/Express API with JWT RBAC middleware (Owner/Admin/Member/Guest)
- **Database:** Neon PostgreSQL via Prisma ORM with composite indexing on all FK columns
- **File Storage:** AWS S3 pre-signed URLs (browser uploads directly to S3, bypassing server memory limits)
- **State Management:** Zustand for UI state, TanStack Query for server state with optimistic updates

### 🐛 The Hardest Technical Bug I Solved
On simulated load testing day, I discovered that the issues list endpoint was making 51 separate database queries for a page of 50 issues (the N+1 query problem). The response time was 3,400ms — completely unacceptable for a production SaaS.

I fixed it by adding `include: { author: true, labels: true }` to the Prisma query and adding `@@index([workspaceId])` to the Issue model schema. Response time dropped to 45ms — a 98.7% improvement — in a single 3-line change.

### 📊 The Business Impact & Metrics
- API response time: 3,400ms → 45ms (98.7% improvement)
- Lighthouse Performance Score: 97/100
- Supported simulated 10,000 daily requests on free-tier Neon DB
- Zero unauthorized data access across 4 tenant workspaces (RBAC validated)
