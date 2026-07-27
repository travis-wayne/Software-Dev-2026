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

---

## 📋 Model Solutions & Answer Key

### Exercise 2: Twitter Back-of-the-Envelope Calculation (Model Answer)

**Assumptions:**
- 300M Monthly Active Users (MAU)
- 100M Daily Active Users (DAU)
- Each user reads 200 tweets/day, posts 2 tweets/day

**QPS Calculations:**
- Write QPS: 100M × 2 tweets ÷ 86,400 seconds = **~2,315 writes/second**
- Peak Write QPS: ~2,315 × 5 (peak multiplier) = **~11,575 writes/second**
- Read QPS: 100M × 200 reads ÷ 86,400 seconds = **~231,500 reads/second**
- Read:Write ratio = **~100:1** → Heavy read optimization needed (caching, CDN, read replicas)

**Storage:**
- Avg tweet: 280 chars = 280 bytes + 100 bytes metadata = ~380 bytes
- Daily writes: 100M × 2 = 200M tweets/day
- Daily storage: 200M × 380 bytes = **~76GB/day**
- 5-year storage: 76GB × 365 × 5 = **~138TB** (excluding media!)
- With media (50% tweets have image, 100KB avg): +100M × 100KB = **+10TB/day additional**

**Bandwidth:**
- Write bandwidth: 2,315 req/s × 380 bytes = **~880KB/s**
- Read bandwidth: 231,500 req/s × 380 bytes = **~88MB/s** (~700Mbps)

### Exercise 1: Pastebin Requirements Clarification (Model Questions)
1. What is the expected DAU and MAU? (Scale sizing)
2. What is the maximum paste size? (Storage calculations)
3. Should pastes expire? If so, what are the expiration options? (TTL design)
4. Do we need user accounts, or are pastes anonymous? (Auth complexity)
5. Do we need analytics (view counts, unique visitor tracking)? (Analytics tier)
6. Is syntax highlighting required? (CDN/rendering complexity)
7. Are custom short URLs (vanity aliases) required? (Collision handling)
8. What are the SLA requirements for availability? (99.9% vs 99.99%)

### Exercise 3: Twitter Fan-Out Model Answer

**Hybrid Fan-Out (Twitter's actual approach):**
- **Regular users (<10k followers):** Push fan-out at write time → pre-populate followers' feed caches immediately
- **Celebrity users (>10k followers, "Bieber Problem"):** Pull fan-out at read time → only inject into feed when followers actually request their feed
- **Why hybrid?** Pure push for 100M Bieber followers = 100M Redis writes every tweet = unacceptable write amplification
