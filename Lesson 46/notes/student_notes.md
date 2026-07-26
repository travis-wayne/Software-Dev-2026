# Lesson 46: System Design Interview Prep
## Student Notes

---

> **The Architect's Mindset**
> System design interviews aren't about memorizing the "right" answer. They're about demonstrating that you can think through ambiguous, open-ended problems systematically — the same way senior engineers do every day. The interviewer wants to see your reasoning process, not your ability to recite architectures.

## 0. Why System Design Interviews Exist
- Junior roles test coding. Senior roles test architectural judgment.
- They simulate the real job: requirements change, data grows 100×, the simple solution breaks.
- Companies use them to identify engineers who can build *tomorrow's* system, not just today's.

## 1. The RESHADED Framework — Your Interview Roadmap

**R — Requirements Clarification (5-10 minutes)**
- Always start by asking questions BEFORE designing anything
- Two types of requirements:
  - Functional: what the system DOES (create short URL, redirect to original, analytics dashboard)
  - Non-Functional: how the system PERFORMS (100ms latency, 99.9% uptime, 10M users/day)
- Example clarifying questions for a URL shortener:
  - What is the expected read:write ratio? (Likely 100:1 — more reads than writes)
  - Do we need custom aliases (e.g., domain.com/my-brand)?
  - Should URLs expire? Who owns the short URL?
  - Do we need analytics (click counts, geography)?
  - What is the target latency for redirects? (< 100ms?)
- Common mistake: jumping straight to drawing boxes. Always clarify first.

**E — Estimation (10 minutes)**
Back-of-the-envelope calculations — show your reasoning:

For the URL Shortener example:
```
Assumptions:
- 500M new URLs/month → ~190 writes/second (500M ÷ 30 ÷ 24 ÷ 3600)
- Read:Write ratio = 100:1 → 19,000 reads/second
- Average URL length = 100 bytes
- Short URL = 7 characters → 7 bytes
- URLs stored forever (no expiry)

Storage:
- Data per record ≈ 300 bytes (URL + metadata + created_at)
- 500M × 300 bytes = 150 GB per month
- 5 years storage = 150GB × 60 = 9 TB

Bandwidth:
- Write bandwidth: 190 × 300 bytes = 57 KB/s (trivial)
- Read bandwidth: 19,000 × 300 bytes = 5.7 MB/s (manageable)

Caches:
- If we cache 20% of hot URLs: 150GB × 0.20 = 30 GB of RAM needed
```
The lesson of estimation: these numbers tell you the system is read-heavy → optimize for reads (add cache, read replicas).

Common estimation building blocks table:
| Resource | 1 day | 1 month | 1 year |
|----------|-------|---------|--------|
| Seconds in a day | 86,400 | - | - |
| 1 KB of data | 1,000 bytes | - | - |
| 1 GB of data | 10^9 bytes | - | - |
| Average web server request/thread | 50ms | - | - |
| Redis throughput | ~1M ops/sec | - | - |
| HDD sequential read | 250 MB/s | - | - |
| SSD sequential read | 3,000 MB/s | - | - |
| Network in same data center | 10 Gbps | - | - |

**S — Storage Schema Design**
- Choose your database type early and justify it
- URL Shortener schema:
  ```sql
  CREATE TABLE urls (
    short_key  CHAR(7)     PRIMARY KEY,  -- 'abc1234'
    long_url   VARCHAR(2048) NOT NULL,
    user_id    INT,
    created_at TIMESTAMP    DEFAULT NOW(),
    expires_at TIMESTAMP,
    click_count BIGINT      DEFAULT 0
  );
  ```
- Why NoSQL might be better: no complex relationships, simple key→value lookup, horizontal scaling, built-in sharding in Cassandra/DynamoDB

**H — High-Level Design**
- Draw the minimal viable architecture first — don't over-engineer!
- For URL Shortener:
  ```
  [Browser] → [Load Balancer] → [App Servers] → [Cache (Redis)] → [Database]
                                      ↓
                              [URL Generation Service]
  ```
- The 6 must-have components in most systems:
  1. Client (browser, mobile app)
  2. DNS + CDN (edge caching for static assets)
  3. Load Balancer (distributes traffic)
  4. App Servers (stateless, horizontally scalable)
  5. Cache (Redis — fast reads)
  6. Database (primary + read replicas)

**A — APIs**
- Define the public API surface area:
  ```
  POST /api/urls
    body: { longUrl: string, customAlias?: string, expiresAt?: timestamp }
    returns: { shortUrl: "https://short.ly/abc1234", shortKey: "abc1234" }

  GET /:shortKey
    returns: 302 Redirect to longUrl
    (or 404 if not found / expired)

  GET /api/urls/:shortKey/stats
    returns: { clickCount, lastClickedAt, createdAt }
  ```
- The redirect returns **302 Found** (temporary) not 301 (permanent) — reason: 301 is cached by browsers, so you lose analytics of future clicks!

**D — Detailed Design**
For each core component, go deep:

**URL Generation Algorithm — 3 Options:**
```
Option 1: MD5 + Base62 Encoding
- MD5(longUrl) → 128-bit hash → take first 43 bits → Base62 encode → 7 chars
- Problem: MD5 collisions — two different URLs could get same short key
- Fix: check DB for collision, retry with next 43 bits

Option 2: Counter + Base62
- Auto-increment integer ID (1, 2, 3, ...) → Base62 encode → 7 chars
- ID 1 → "0000001", ID 3,521,614,606,208 → "ZZZZZZZ" (7-char ceiling)
- Problem: single counter is a bottleneck, reveals sequential IDs (enumerable)
- Fix: distributed ID generator (Snowflake IDs)

Option 3: Snowflake ID (Twitter's algorithm)
- 64-bit ID = 41 bits timestamp + 10 bits machine ID + 12 bits sequence
- Globally unique, sortable by time, no central counter
- Best choice for distributed systems
```

**E — Evaluate Bottlenecks**
For each bottleneck:
- Bottleneck: Database reads (19,000/sec) → Solution: Redis cache with LRU eviction
- Bottleneck: Single database write bottleneck → Solution: read replicas, eventual consistency
- Bottleneck: Single app server → Solution: stateless servers behind load balancer (auto-scale)
- Bottleneck: URL lookup latency → Solution: CDN edge nodes cache popular redirects
- Bottleneck: Storage growing to 9TB → Solution: database sharding by short key hash

**D — Deep Dive a Component**
Pick the most interesting one (Cache):
- Cache eviction policies: LRU (Least Recently Used) — perfect for URL shorteners (hot URLs stay cached)
- Cache-aside pattern: app checks cache first, on miss → queries DB → writes to cache
- Cache invalidation: when URL expires, delete from cache immediately
- Cache hit ratio target: 80%+ (80% of reads served from memory, 20% hit DB)
- Redis Cluster for multi-master horizontal scaling: partition cache across 6 nodes (3 masters + 3 replicas)

## 2. Key System Components Reference

| Component | What it Does | When to Use | Famous Implementations |
|-----------|-------------|-------------|----------------------|
| Load Balancer | Distribute traffic across multiple servers | Any system with >1 app server | AWS ALB, NGINX, HAProxy |
| CDN | Serve static assets from edge nodes near users | Global users, static content | Cloudflare, AWS CloudFront |
| Redis Cache | In-memory key-value store, microsecond reads | Read-heavy, session storage, leaderboards | Upstash Redis, Redis Cloud |
| Message Queue | Async task processing, decouple services | Background jobs, notifications | Apache Kafka, AWS SQS |
| Read Replicas | Secondary DB copies that serve reads | Read-heavy workloads | Neon branches, AWS RDS Multi-AZ |
| Database Sharding | Horizontal partitioning of data across DBs | Data too large for one DB (TB+) | Vitess (YouTube), Cassandra |
| Consistent Hashing | Distribute data with minimal redistribution when nodes change | Sharded caches and DBs | Dynamo (Amazon) |

## 3. The URL Shortener — Full Solution Walkthrough

**Architecture Diagram (ASCII)**
```
                      +-------------------+
                      |                   |
                      |     Clients       |
                      |                   |
                      +---------+---------+
                                |
                                v
                      +-------------------+
                      |                   |
                      |   DNS / CDN       |
                      |                   |
                      +---------+---------+
                                |
                                v
                      +-------------------+
                      |                   |
                      |  Load Balancer    |
                      |                   |
                      +----+---------+----+
                           |         |
           +---------------+         +---------------+
           |                                         |
           v                                         v
 +-------------------+                     +-------------------+
 |                   |                     |                   |
 |   App Server 1    |                     |   App Server 2    |
 |                   |                     |                   |
 +----+----+---------+                     +---------+----+----+
      |    |                                         |    |
      |    +-----------------------------------------+    |
      |                                                   |
      v                                                   v
+-------------------+                             +-------------------+
|                   |                             |                   |
|   Redis Cache     |                             |  URL Gen Service  |
|                   |                             |  (Snowflake IDs)  |
+---------+---------+                             +-------------------+
          |
          v
+-------------------+
|                   |
|   PostgreSQL      +------> [Read Replica 1]
|   Primary (Write) |
|                   +------> [Read Replica 2]
+-------------------+
```

**Component Choices & Justifications**
1. **Load Balancer**: Distributes traffic to prevent any single app server from being overwhelmed. NGINX or HAProxy works well.
2. **App Servers**: Stateless Node.js or Go servers. They handle API routing and logic. Easily auto-scaled.
3. **URL Generation Service**: Uses Snowflake ID generation to create unique IDs which are then base62 encoded. This avoids database single-point-of-failure bottlenecks.
4. **Cache**: Redis, using LRU eviction. Caches hot URLs. 19,000 reads/sec is too high for a single SQL DB without severe indexing/memory costs, but trivial for Redis.
5. **Database**: PostgreSQL with Read Replicas. The write load (190/s) is well within single-master PG limits, while read replicas offload any cache-miss reads.
6. **CDN**: To cache static assets, and possibly edge-cache the most viral URLs to completely bypass our infrastructure.

## 4. Practicing Common Design Problems
- **Twitter Feed** (fan-out problem — push model vs pull model)
  - Q1: How many users? Q2: What's the read:write ratio? Q3: Can feeds be eventually consistent?
  - Constraint: Justin Bieber has 50M followers. A push model would write 50M records immediately.
  - Choice: Hybrid model. Push for active users, pull for inactive or celebrity followers.
- **WhatsApp** (WebSockets, message delivery guarantees, E2E encryption)
  - Q1: Group chats vs 1-on-1? Q2: Media limits? Q3: How long to store messages?
  - Constraint: Offline users receiving messages.
  - Choice: Store-and-forward message queues per user.
- **Netflix** (CDN, adaptive bitrate streaming, recommendation engine)
  - Q1: What is the resolution mix? Q2: Global distribution? Q3: Analytics frequency?
  - Constraint: Enormous bandwidth requirements.
  - Choice: Open Connect (custom CDN boxes in ISPs).
- **Uber** (geospatial indexing, real-time location, surge pricing)
  - Q1: Driver update frequency? Q2: Matching latency? Q3: Disconnects?
  - Constraint: 2D space search (finding nearest drivers).
  - Choice: Geohash / S2 Geometry indexing in Redis or Cassandra.
- **Google Docs** (operational transforms, conflict-free replicated data types)
  - Q1: Max concurrent users per doc? Q2: Offline editing? Q3: Version history?
  - Constraint: Conflict resolution when two users type at the exact same position simultaneously.
  - Choice: CRDTs (Conflict-free Replicated Data Types).

## 5. Interview Communication Tips
- Think aloud: narrate every decision ("I'm choosing Redis here because...")
- Draw BEFORE explaining: sketch it fast, talk through it
- Ask for confirmation: "Does that make sense? Should I go deeper on the cache layer?"
- Catch yourself: "Actually, I realize I should have asked about — what's the expected read:write ratio?"
- Handle uncertainty well: "I haven't used Kafka directly, but I know it's a distributed log system designed for..."

## 6. Common Interview Mistakes
| Mistake | Why It Hurts | What to Do Instead |
|---------|-------------|--------------------|
| Starting to design immediately | Wastes time solving the wrong problem | Spend 5-10 min on requirements first |
| Over-engineering too early | Designing for 10B users when asked to design for 1M | Scale to the stated requirements |
| Silent thinking | Interviewer can't guide you or give hints | Think out loud, always |
| Ignoring non-functional requirements | System has wrong latency or availability profile | Address CAP theorem, SLAs explicitly |
| Handwaving the hard parts | "We'll just add more servers" — how? | Be specific about sharding keys, cache invalidation |
| Not knowing your numbers | Can't estimate → can't make trade-offs | Memorize the latency numbers table |

**Quick Reference: Latency Numbers Every Engineer Should Know**
| Operation | Approximate Latency |
|-----------|--------------------|
| L1 cache reference | 1 ns |
| L2 cache reference | 4 ns |
| Main memory (RAM) reference | 100 ns |
| SSD random read | 16 μs |
| HDD random read (seek) | 10 ms |
| Network round trip (same data center) | 500 μs |
| Network round trip (cross-continent) | 150 ms |
| Redis GET | ~0.1 ms |
| PostgreSQL indexed query (single row) | ~1 ms |
| PostgreSQL full table scan (1M rows) | ~100 ms |

**Next Steps**: Check out Lesson 47 (Capstone Project Planning).
