# Lesson 45: Microservices Architecture & API Gateways
## Tutor Notes

### 1. Session Overview
90-minute session outline:
| Time | Duration | Section | Activity |
|------|----------|---------|----------|
| 00:00-00:10 | 10 min | Hook | Show a monolith vs microservice visual. Ask: 'What happens when Amazon needs to scale just their checkout at Black Friday?' |
| 00:10-00:25 | 15 min | Monolith Problem | The Swiss Army Knife analogy. Draw on whiteboard. |
| 00:25-00:40 | 15 min | Microservices Core | City Government analogy. 5 core principles. |
| 00:40-00:55 | 15 min | API Gateway Deep Dive | Hotel Concierge analogy. Walk through the demo gateway code. |
| 00:55-01:10 | 15 min | Interactive Lab | Students use Tab 1 & Tab 2 of the glassmorphism lab |
| 01:10-01:20 | 10 min | Chaos Lab | Tab 3 — take services offline, watch Circuit Breaker |
| 01:20-01:30 | 10 min | Quiz & Wrap-up | Tab 4 mastery quiz + Q&A |

### 2. Teaching Analogies Deep-Dive

**The Restaurant Kitchen Brigade (Mise en Place):**
A monolithic kitchen has one chef who cooks, plates, manages inventory, takes orders, and handles billing. If the chef is sick, the whole restaurant closes. A microservices kitchen has: Head Chef (API Gateway), Garde Manger (Salad/Starters), Saucier (Sauces/Main), Pastry Chef (Desserts), Expediter (aggregates plates before serving). If the Pastry Chef is unavailable, the restaurant still serves starters and mains!

**The Electrical Circuit Breaker:**
Your home circuit breaker prevents one overloaded appliance from burning down the whole house. In software, a Circuit Breaker prevents one failing service from taking down the entire system. Ask students: 'What happens without a circuit breaker when Product Service has a memory leak?'

### 3. Production War Stories

**War Story 1: The Monolith That Couldn't Scale Black Friday**
An e-commerce startup built a Node.js + PostgreSQL monolith that worked great for 2 years. When Black Friday arrived, they needed 10x capacity for checkout only — but couldn't scale checkout without scaling the ENTIRE application (user profiles, admin dashboard, email templates — everything). Their $5,000/month server bill jumped to $50,000. Worse, their database migrations required full downtime — so deploying a hotfix during peak traffic was impossible. The fix took 9 months and a full rewrite into services. Lesson: Traffic spikes are service-specific — microservices let you scale only what needs scaling.

**War Story 2: The Distributed Monolith (Worse Than the Original)**
A startup decomposed their app into 12 microservices. But they shared a single PostgreSQL database across all 12! When the schema changed for Service A, it broke Services B, C, and D. They also deployed all 12 services together in lockstep. They had all the complexity of microservices with none of the independence. The distributed monolith is the most common and most painful anti-pattern. The fix: enforce database-per-service with Prisma, give each service its own Neon database branch.

**War Story 3: The Missing Circuit Breaker**
A payment platform had 6 microservices. User → Gateway → Order → Inventory → Payment → Notification. When Notification Service had a memory leak and started responding in 8 seconds (instead of 50ms), every request waited 8 seconds for the notification. All thread pool slots filled up. This cascaded: Payment Service hung, then Order Service hung, then the entire platform was down in 4 minutes. Root cause: no Circuit Breaker — each service blindly waited for the next to respond. Fix: opossum Circuit Breaker with 500ms timeout threshold.

### 4. Live Coding Demo Guide
Walk through `examples/microservices-gateway-demo/`:
1. Start all 4 services: `pnpm dev`
2. Show `gateway.js` — how routing is configured
3. Make a request directly to user-service: `curl http://localhost:3010/users`
4. Make the same request through the gateway: `curl http://localhost:3009/api/users`
5. Show how the gateway adds `X-Gateway-Version` and `X-Request-Id` headers
6. Simulate a service being down: stop user-service, try through gateway — show 503 + Circuit Breaker error message
7. Show docker-compose.yml for running in containers

### 5. Comprehension Q&A

**Q1: What is the key difference between a monolith and microservices?**
*Answer:* A monolith is deployed as a single unit and usually shares one database. Microservices are small, independently deployable units that own their own data and communicate over the network.

**Q2: Why is sharing a database between microservices an anti-pattern?**
*Answer:* It creates hidden coupling. If Service A changes the table schema, Service B might crash if it relies on that table. Each service should manage its own state.

**Q3: What does an API Gateway do that individual services cannot do themselves?**
*Answer:* It provides a single entry point for clients, handles cross-cutting concerns like rate limiting and auth in one place, and can aggregate data from multiple services.

**Q4: When would you choose asynchronous messaging over synchronous REST calls?**
*Answer:* For non-critical background tasks (like sending emails) or when you want to avoid temporal coupling (where the caller breaks if the receiver is down).

**Q5: Explain the Circuit Breaker pattern in your own words.**
*Answer:* It monitors a service for failures. If failures pass a threshold, it trips "open" to immediately return errors without calling the failing service, giving it time to recover.

**Q6: What is a 'Distributed Monolith' and why is it the worst of both worlds?**
*Answer:* It's when you have separate services but they are so tightly coupled (via shared DB or sync calls) that you must deploy them together. You get all the complexity of network calls with none of the benefits of independence.

**Q7: A startup has 5 developers and is building an MVP. Should they use microservices?**
*Answer:* No. Start with a monolith to move fast. They don't know their domain boundaries yet, and the DevOps overhead of microservices will slow them down.

**Q8: How does Kubernetes Service Discovery work?**
*Answer:* Kubernetes provides an internal DNS server. Services resolve each other using predictable names (e.g., `http://my-service.namespace.svc.cluster.local`) which load balances across available Pods.

### 6. Live Debug Scenarios (5 scenarios)
For the classroom:
1. **Gateway returns 502 Bad Gateway** — Service not running (Forgot to start it, or crashed).
2. **Service returns data but slowly** — Missing connection pooling to the database (every request opens a new DB connection).
3. **Circular service calls** — A calls B calls A — stack overflow or infinite timeout loop.
4. **Auth working in gateway but failing in service** — The gateway forgot to forward the `Authorization` header to the downstream service.
5. **docker-compose services can't find each other** — Wrong hostname. Trying to use `localhost` instead of the service name (e.g., `user-service`).

### 7. Common Student Gotchas
- **Gotcha:** Thinking `localhost` inside a Docker container points to their Mac/PC.
  - *Explanation:* Explain that `localhost` in Docker means *that specific container*. They must use the service name.
- **Gotcha:** Thinking microservices must be written in different languages.
  - *Explanation:* They *can* be, but they don't have to be. It's often better to stick to one stack (e.g., Node/TS) unless there's a specific need (e.g., Python for ML).
- **Gotcha:** Creating a "Database Service" that all other services talk to.
  - *Explanation:* This is just a monolith with extra steps. Each service needs its own direct DB connection.
