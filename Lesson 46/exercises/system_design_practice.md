# System Design Practice Exercises

**Exercise 1: Requirements Clarification Sprint (10 mins)**
You're given: "Design a Pastebin (like pastebin.com) where users can share text snippets via a URL."
Task: Write down AT LEAST 8 clarifying questions you would ask the interviewer before drawing anything.
Prompt: Think about users, scale, features, non-functional requirements, and edge cases.

**Exercise 2: Back-of-the-Envelope Estimation**
Given these assumptions for a Twitter-like system:
- 300M monthly active users, 10% post daily → 30M tweets/day
- Each tweet: 280 chars = 280 bytes. With metadata: ~500 bytes.
- Each tweet has 2 images on average: ~200 KB each
- Read:Write ratio for timeline: 200:1
Calculate: (a) tweets per second (b) bytes written per second (c) bytes read per second (d) storage needed for 5 years (e) CDN bandwidth needed for images.
Show all working.

**Exercise 3: Twitter Fan-Out Design Challenge**
Problem: When a celebrity with 50M followers posts a tweet, how do you deliver it to all followers quickly?
- Approach A: Pull model — followers fetch their timeline by querying who they follow
- Approach B: Push model (fan-out on write) — pre-compute and write to all 50M follower feeds on post
Analyze trade-offs:
- Which is better for celebrities vs regular users?
- What is the hybrid approach Twitter actually uses?
- How would you handle the "Justin Bieber problem" (extremely popular accounts)?

**Exercise 4: Identify the Bottleneck**
You're given a system description for a URL shortener:
"We have 2 app servers, each running Node.js. They connect to 1 PostgreSQL database. We use no cache. All our traffic comes from the US. We get 10,000 redirect requests per second. Our average redirect latency is 850ms."
Identify ALL bottlenecks and propose a specific fix for each.
(Expected answers: no cache, single DB, single region, connection pool exhaustion, no CDN)
