# Lesson 46: System Design Interview Prep
## Tutor Notes

### 1. Session Overview — 90 Minute Timetable
| Time | Duration | Section | Activity |
|------|----------|---------|----------|
| 00:00-00:05 | 5 min | Hook | Show a real Facebook/Google job description that says 'system design interview'. Ask: 'What makes a senior engineer different from a junior one?' |
| 00:05-00:20 | 15 min | RESHADED Framework | Walk through the acronym with the student. Use the whiteboard or Tab 1 of the lab. |
| 00:20-00:25 | 5 min | Estimation Practice | Use Tab 2 of the lab (Estimation Calculator). Do 2-3 quick calculations together. |
| 00:25-01:00 | 35 min | Mock Interview: URL Shortener | You play the interviewer. Student leads. Guide them through RESHADED. Don't give answers — ask questions. |
| 01:00-01:10 | 10 min | Debrief | What went well? What would an actual interviewer have penalized? |
| 01:10-01:25 | 15 min | Architecture Components Deep Dive | Tab 3 of the lab — click through Load Balancer, Redis, Kafka cards |
| 01:25-01:30 | 5 min | Quiz & Assignment | Tab 4 quiz + assign 'Design Twitter Feed' |

### 2. How to Play the Interviewer
Script for the mock URL shortener session:
- Opening: "Let's design a URL shortener like TinyURL. Where would you like to start?"
- After requirements: "Assume 500 million URLs created per month. What does that mean for our system?"
- After high-level design: "What happens if this single database goes down?"
- After caching: "How do we handle the case where a URL expires — what happens to the cached version?"
- At the end: "If we had to scale to 10× traffic, which component would break first?"

Don'ts:
- Don't give answers unprompted — wait for the student to get stuck for 2+ minutes first
- Don't accept hand-wavy answers: "Add more servers" → ask "How? Which algorithm routes requests?"
- Don't skip estimation — it's where most candidates fail

**Expanded Mock Interview Script — Branching Follow-Up Questions:**

After the existing mock interview script, add branching scenarios:

**If student misses vanity alias collision handling:**
> Interviewer: "Great! You've designed the ID generation. But what if two users both try to register the custom alias 'google' at the same time?"
- Bad answer: "Whoever submits first wins" (doesn't address race condition)
- Good answer: Use DB unique constraint + optimistic concurrency: `INSERT INTO urls (slug) VALUES ('google') ON CONFLICT DO NOTHING` — then check if 0 rows inserted and return 409 Conflict

**If student misses analytics tracking:**
> Interviewer: "Your URL shortener is popular. The marketing team now wants real-time analytics — which countries, devices, referrers are clicking each link. How do you add this without slowing down redirects?"
- Answer: Don't block the redirect. Fire-and-forget to a Kafka topic (`url_clicked` event). An analytics consumer service writes to ClickHouse (column-store optimized for aggregation). Redirect response time stays under 50ms.

**Coaching Tips for Interview-Frozen Students:**
- If student goes completely silent: Prompt with "Start by thinking out loud — what is the simplest possible system that could work?"
- If student jumps straight to complexity: "Before microservices, can you design a simpler single-server version?"
- If student uses the wrong data structure: Ask "What is the read:write ratio for this system?" to guide them toward the right choice.
- Physical tip: Teach students to write/draw on the whiteboard WHILE they talk — interviewers evaluate process, not just the final answer.

### 3. Production War Stories

**War Story 1: The 301 vs 302 Redirect Mistake**
A mid-stage startup built a URL shortener for marketing campaigns. They used `301 Moved Permanently` for redirects because it's semantically correct for "this URL now lives here". Three months later, their analytics dashboard showed zero clicks on all their campaign links. The problem: browsers cached 301 redirects permanently. Once a user visited a link, their browser never contacted the server again — it redirected locally. The marketing team had no idea how many people were actually clicking their campaigns. Emergency fix: switch all new URLs to 302, but the old 301s were already cached in millions of browsers forever. Lesson: every HTTP status code has architectural consequences. Know your codes.

**War Story 2: The Cache Stampede at 9AM**
An e-commerce platform cached their product catalogue in Redis with a 60-second TTL. At 9AM every day, their nightly batch job would finish re-indexing all products. This expired 50,000 cache keys simultaneously. In that 1-second window, 5,000 concurrent requests all got cache misses and hit the database at once — "the thundering herd". The PostgreSQL database couldn't handle the spike and went down, taking the site with it for 4 minutes during peak traffic. Fix: jitter the TTL (60s ± random 10s), use cache-aside with probabilistic early expiry, or use a distributed lock (Redis SETNX) on the first requester while others wait. Lesson: cache invalidation is one of the two hardest problems in computer science.

**War Story 3: The Interview That Won a $300K Job Offer**
A senior candidate at a top tech company was asked to design a distributed rate limiter. Instead of launching into the solution immediately, she spent 8 minutes asking clarifying questions: "Is this per user, per IP, or per API key? Should it be exact or approximate? What latency budget does the rate limiter have — can we tolerate 5ms overhead? What happens at boundaries — sliding window or fixed window?" The interviewer later said she was the first candidate in 20 sessions who asked about sliding vs fixed window. Her questions demonstrated senior-level thinking before drawing a single box. The offer was $300K total comp. Lesson: the questions you ask reveal your seniority more than your diagram.

### 4. Comprehension Q&A (with full answers)
**Q1: Why do we start a system design interview by asking clarifying questions?**
A1: To narrow the scope, define constraints, and show the interviewer you don't make blind assumptions. Solving the wrong problem is an automatic fail.

**Q2: What's the difference between functional and non-functional requirements?**
A2: Functional: What the system does (features like URL redirect). Non-functional: How well it does it (performance, latency, availability, scale).

**Q3: A URL shortener has 100:1 read-write ratio. What architectural implication does this have?**
A3: The system is heavily read-bound. We must optimize for reads by adding a caching layer (Redis) and read replicas for the database.

**Q4: Why should a URL shortener return 302 rather than 301 for redirects?**
A4: 301 (Permanent) is cached indefinitely by the browser. We would lose tracking data for subsequent clicks. 302 (Found/Temporary) forces the browser to hit our server every time, allowing us to log the click for analytics.

**Q5: What is the Cache-Aside pattern and how does it work?**
A5: The application code manages the cache. It first checks the cache; if there's a miss, it queries the database, writes the result to the cache, and then returns the data to the user.

**Q6: What is the "thundering herd" problem and how do you prevent it?**
A6: When a highly requested cache key expires, many concurrent requests all experience a cache miss and hit the database simultaneously, potentially crashing it. Prevent it by jittering TTLs or using distributed locks for cache refilling.

**Q7: When would you choose NoSQL over SQL for a URL shortener?**
A7: When horizontal scaling is the primary concern, data relationships are simple (key-value), and you are willing to trade ACID compliance for high availability and partition tolerance.

**Q8: What does CAP theorem mean for system design decisions?**
A8: In the presence of a network Partition, you must choose between Consistency (all nodes see the same data) and Availability (every request receives a response). You can't have both when the network splits.

### 5. Live Debug Scenarios / Interview Probes
1. **Student goes straight to drawing** — Interject: "Wait, before you draw, what exactly are we building? Who are the users?" Redirect to requirements first.
2. **Student says "I'd use microservices" without justification** — Probe: "Why not a monolith for this scale? What benefits do microservices give us here, and what operational overhead do they introduce?"
3. **Student proposes sharding on Day 1** — Probe: "At what point does a URL shortener actually need sharding? Let's check our storage estimates. Do we need it now?"
4. **Student doesn't mention cache** — Probe: "With 19,000 reads/second, how does our single PostgreSQL database handle that load without melting?"
5. **Student uses SQL without asking about read/write ratio** — Probe: "Wait, how many reads vs writes do we expect? Does this choice still make sense?"
