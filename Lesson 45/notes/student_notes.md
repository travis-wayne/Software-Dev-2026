# Lesson 45: Microservices Architecture & API Gateways
## Student Notes

---

> **The Swiss Army Knife Problem**
> Imagine you have a single Swiss Army Knife. It's great at everything — but when you need to cut a steak (scale your payment processing), you can't replace just the knife blade without replacing the entire tool. That's a monolith. Microservices give each job its own dedicated, replaceable tool.

## 1. The Monolith Problem — Why We Need Microservices
A monolithic architecture is an application built as a single, unified unit. There is one codebase, one deployment process, and typically one relational database. Everything is tightly coupled.

```text
+-----------------------------------------------------+
|                 E-Commerce Monolith                 |
|                                                     |
|  +--------+  +----------+  +--------+  +---------+  |
|  |  Auth  |  | Products |  | Orders |  | Billing |  |
|  +--------+  +----------+  +--------+  +---------+  |
|                                                     |
+-----------------------------------------------------+
                          |
                          v
                +-------------------+
                | Shared PostgreSQL |
                +-------------------+
```

### The 4 Scaling Problems:
1. **Long Build Times**: A tiny change in the Auth module requires rebuilding and redeploying the entire app.
2. **Team Bottlenecks**: When 50 developers touch the same codebase, merge conflicts happen constantly. You have to coordinate deployments carefully.
3. **Inability to Scale Specific Parts**: If it's Black Friday and traffic spikes for viewing products, you have to scale the *entire application* (including the billing code), wasting huge amounts of memory and CPU.
4. **Technology Lock-in**: If you started the app in Node.js 14, and there's a legacy PDF generator that only works on Node 14, the entire app is stuck on Node 14.

### The "Spaghetti Code" Escalation
Over 3 years, well-intentioned monoliths degrade. The Order module directly imports functions from the Billing module. The Auth module starts writing to the Order tables. The code becomes unmaintainable "spaghetti."

---

## 2. What Are Microservices?
A microservice architecture structures an application as a collection of small, independently deployable services that each own a specific business capability.

```text
               +-------------+
               | API Gateway |
               +-------------+
                 /    |     \
               /      |       \
             /        |         \
+--------------+ +---------------+ +---------------+
| User Service | |Product Service| | Order Service |
| (Auth, Prof) | |(Catalog, Inv) | | (Cart, Pay)   |
+--------------+ +---------------+ +---------------+
       |                 |                 |
+--------------+ +---------------+ +---------------+
| PostgreSQL   | | MongoDB Atlas | | PostgreSQL    |
+--------------+ +---------------+ +---------------+
```

### The 5 Core Principles:
1. **Single Responsibility**: Each service does ONE thing well.
2. **Loose Coupling**: Services don't know each other's internals.
3. **High Cohesion**: All code for one business domain lives together.
4. **Bounded Context**: Each service owns its OWN database (never share!).
5. **Independent Deployability**: Deploy one service without touching others.

### The City Government Analogy
Think of microservices like a city government. The Police Dept, Fire Dept, Schools, and Hospitals each have their own budget, staff, tools, and chain of command. They collaborate via well-defined protocols (emergency calls = REST APIs), not by sharing staff or jumping into each other's offices.

---

## 3. The API Gateway — Your Hotel Concierge
If you have 50 microservices, it's chaos if clients (mobile apps, web browsers) have to memorize 50 different IP addresses and ports (e.g., User Service on port 3010, Product on 3011).

**The Hotel Concierge Analogy**: You walk up to ONE desk and say what you need. The concierge knows which department to contact. You never deal with housekeeping, kitchen, and maintenance directly.

### What an API Gateway Does:
| Responsibility | Description |
|---------------|-------------|
| Request Routing | Route GET /products → Product Service |
| Authentication | Verify JWT once — don't make every service verify |
| Rate Limiting | Block IP after 100 requests/minute |
| SSL Termination | Handle HTTPS, services talk HTTP internally |
| Request Aggregation | Combine User + Orders into one response |
| Logging & Monitoring | Central place to trace all requests |
| Load Balancing | Round-robin between multiple instances |

**Example simple Express Gateway routing logic:**
```javascript
app.use('/api/users', createProxyMiddleware({ target: 'http://user-service:3010' }));
app.use('/api/orders', createProxyMiddleware({ target: 'http://order-service:3012' }));
```

**Popular Tools:** Kong, AWS API Gateway, NGINX, Traefik, Express-gateway.

---

## 4. Inter-Service Communication
How do services talk to each other?

### Synchronous (REST/gRPC)
- Direct HTTP call from one service to another.
- Simple, but creates **temporal coupling** (if Product Service is down, Order Service breaks immediately).
- **gRPC**: Faster binary protocol, strongly typed. Used by Netflix and Google for internal traffic.
- **When to use**: When you need an immediate response (e.g., user login, product lookup).

### Asynchronous (Message Queues)
- Service publishes an event to a queue (Kafka, RabbitMQ, AWS SQS).
- Other services subscribe and react when they're ready.
- **Decoupled**: Order Service doesn't care if Notification Service is temporarily down.
- **When to use**: Background tasks (send email, generate report, update analytics).

**The Pattern:**
```text
Order placed → Order Service publishes "ORDER_CREATED" event to message queue
↓ (async)
Notification Service picks up event → sends email
Analytics Service picks up event → updates dashboard
Inventory Service picks up event → decrements stock
(All three happen in parallel without Order Service waiting!)
```

### The Saga Pattern
Used for distributed transactions across multiple services when you don't have a single database to handle ACID rollbacks.

---

## 5. Service Discovery — How Services Find Each Other
Microservices don't have fixed addresses. Containers restart with new IPs constantly.

**Two approaches:**
1. **Client-side discovery**: Service asks a service registry (Consul, Eureka) for the address.
2. **Server-side discovery**: Load balancer handles it (Kubernetes Service object).

In Kubernetes, every service gets a DNS name. `user-service.default.svc.cluster.local` always resolves to the current IP of user-service pods.
In Docker Compose, we use environment variables: `USER_SERVICE_URL=http://user-service:3010`.

---

## 6. Database Per Service — The Golden Rule
**NEVER share a database between microservices!** This creates hidden coupling. If two services share a database, and one changes the schema, the other breaks.

Data can ONLY be accessed via the service's API.

**Polyglot Persistence (Different DBs for Different Needs):**
| Service | Best DB | Why |
|---------|---------|-----|
| User Service | PostgreSQL (Neon) | Relational, ACID compliance for auth |
| Product Service | MongoDB Atlas | Flexible schema for product attributes |
| Search Service | Elasticsearch | Full-text search optimized |
| Session Service | Redis | Blazing-fast key-value, auto-expiry |
| Analytics Service | ClickHouse/BigQuery | Columnar, optimized for aggregations |

---

## 7. Resilience Patterns — Surviving Failures

### Circuit Breaker Pattern (The electrical circuit analogy)
- **CLOSED state**: Requests flow normally.
- If failures exceed threshold → trips to **OPEN state**: Returns error immediately without calling the failed service (fast fail).
- After a timeout → enters **HALF-OPEN**: Allows one test request through.
- If test succeeds → back to CLOSED. If it fails → back to OPEN.

```text
[CLOSED] --(fail > threshold)--> [OPEN]
   ^                               |
   |-(success)- [HALF-OPEN] <-(timeout)-
```
*Libraries: `opossum` (Node.js), `resilience4j` (Java)*

### Retry Pattern
Automatically retry failed requests with exponential backoff (e.g., 1st retry: wait 1s, 2nd retry: wait 2s, 3rd retry: wait 4s). This prevents the "thundering herd" problem where you accidentally DDOS your own failing service.

### Bulkhead Pattern (The ship hull analogy)
If one part of a ship floods, watertight compartments prevent the whole ship from sinking. In software, limit the number of concurrent connections to each service. If Product Service is slow, it doesn't consume all thread pool resources and crash Order Service too.

---

## 8. When NOT to Use Microservices
Start with a monolith, extract services when you have PROVEN scale pain ("Monolith First" — Martin Fowler).

- **Small teams (<8 developers)**: The operational overhead exceeds the benefit.
- **New products**: You don't know the domain boundaries yet. Get them wrong and services become tightly coupled.
- **The "Distributed Monolith" anti-pattern**: Tightly coupled services that must all be deployed together. The worst of both worlds!

| Factor | Choose Monolith | Choose Microservices |
|--------|----------------|--------------------|
| Team size | <8 devs | Multiple autonomous teams |
| Traffic | Predictable, moderate | Spiky, high-scale |
| Domain knowledge | Still learning | Well-understood bounded contexts |
| Operational maturity | No DevOps culture | Kubernetes/CI-CD in place |
| Development stage | MVP / startup | Scaling established product |

---

## 9. Cloud Provider Support
- **AWS**: ECS (Fargate), EKS (Kubernetes), API Gateway + Lambda
- **GCP**: Cloud Run (serverless containers), GKE
- **Azure**: AKS, Azure API Management
- **Vercel pattern**: Next.js API Routes as microservice-like serverless functions + Neon PostgreSQL per service namespace.

---

## 10. Saga Pattern Deep Dive — Coordinating Distributed Transactions

Explain the problem: In microservices, you cannot use a single SQL transaction across multiple services. If Order Service writes to DB and then Payment Service fails, you need a rollback strategy — this is the Saga Pattern.

Two types with ASCII sequence diagrams:

**Choreography Saga (Event-Driven):**
```
Client
  │
  ▼
Order Service ──creates order──▶ [Event: ORDER_CREATED]
                                         │
                                         ▼
                              Payment Service ──processes──▶ [Event: PAYMENT_SUCCESS]
                                                                      │
                                                                      ▼
                                                        Inventory Service ──reserves──▶ [Event: STOCK_RESERVED]
                                                                                                │
                                                                                                ▼
                                                                                   Notification Service ──sends email
```
Compensating transactions: If PAYMENT_FAILS event fires, Order Service listens and cancels the order.

**Orchestration Saga (Central Coordinator):**
```
Client
  │
  ▼
Saga Orchestrator
  ├──1. Create Order──▶ Order Service ──▶ Success
  ├──2. Charge Card──▶ Payment Service ──▶ Success  
  ├──3. Reserve Stock──▶ Inventory Service ──▶ FAIL!
  │                                              │
  │   ◀── compensate: Refund Card ──────────────┘
  └── compensate: Cancel Order ──▶ Order Service
```
Pros/Cons table: Choreography (decoupled but harder to debug) vs Orchestration (visible workflow but single point of failure)

---

## 11. Distributed Tracing — Finding Bugs Across Services

The problem: When a request spans 5 microservices and something fails after 2 seconds, which service caused the delay? `console.log` is useless across distributed systems.

Solution: OpenTelemetry W3C Trace Context
- Every incoming request gets assigned a `traceId` (unique per request) and `spanId` (unique per service hop)
- Each service propagates the trace context via HTTP headers:
  ```
  traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
  ```
- All spans from all services are collected by a tracing backend (Jaeger, Zipkin, or Grafana Tempo)
- You get a waterfall timeline showing exactly which service took how long!

Code snippet showing OpenTelemetry instrumentation in Node.js/Express:
```javascript
// Install: npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const sdk = new NodeSDK({
  serviceName: 'order-service',
  instrumentations: [getNodeAutoInstrumentations()]
});
sdk.start();
// That's it! Express routes are automatically traced.
```
When to use: Mandatory in production microservices with 3+ services.

---

## 12. When NOT to Use Microservices (The Monolith-First Rule)

Do NOT jump to microservices if:
- Your team has fewer than 8 engineers (Conway's Law: your system mirrors your org structure)
- You don't have solid CI/CD pipelines yet
- Your domain boundaries are unclear (splitting prematurely creates the Distributed Monolith anti-pattern!)
- You haven't had real scaling problems yet

Decision checklist table:
```
| Signal | Go Microservices | Stay Monolith |
|--------|-----------------|---------------|
| Team size | 8+ engineers | < 8 engineers |
| Deploy frequency | Multiple per day | Weekly |
| Clear domain boundaries | Yes | Unclear |
| Independent scaling needs | Yes | One bottleneck |
| CI/CD maturity | Automated pipelines | Manual deploys |
```
Martin Fowler's rule: "Don't start a new project with microservices, even if you're sure your application will be large enough to make it worthwhile."

---

## 13. Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Sharing a database between services | Hidden coupling — schema changes break other services | Enforce database-per-service rule from day one |
| Making synchronous calls for everything | Cascading failures — one slow service delays everyone | Use async message queues for non-critical paths |
| Too-fine-grained services (nanoservices) | Service for `getEmailById`? Absurd overhead! | Services should align with business domains, not functions |
| No API Gateway | Clients juggle dozens of service URLs | Always introduce a gateway as the single entry point |
| Not implementing Circuit Breakers | One failing service cascades to crash the whole system | Use opossum or similar library from the start |
| Distributed monolith | Services deployed together, calling each other synchronously | Review service boundaries — true independence requires event-driven design |
| Skipping distributed tracing | A request spans 5 services — where did it fail? | Implement OpenTelemetry / Jaeger / AWS X-Ray from day one |

---

## Quick Reference Cheat Sheet
- **Monolith**: One codebase, one deployment.
- **Microservice**: Small, independent, focused on one capability.
- **API Gateway**: Single entry point for all clients.
- **Circuit Breaker**: Stops calling a failing service to prevent cascading failures.
- **Message Queue**: For async communication (RabbitMQ, Kafka).

## Next Steps
In Lesson 46, we'll dive deep into Message Queues & Event-Driven Architecture to solve the synchronous communication bottleneck.
