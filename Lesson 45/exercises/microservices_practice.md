# Lesson 45: Microservices Practice Exercises

## Exercise 1: Decompose a Social Media Monolith
**Scenario**: You have a monolithic social media app with the following features:
- User registration and login
- Creating text and image posts
- Following other users
- A feed of posts from people you follow
- Direct messaging between users
- Push notifications when someone likes your post
- Searching for users
- Showing trending hashtags

**Task**: Decompose this monolith into 4-6 microservices. Give each service a name and list which of the above features belong to it. Which database type would you choose for each?

---

## Exercise 2: Design the API Gateway Routing Table
**Scenario**: You are configuring an API Gateway for an E-Commerce platform with three services: `user-service`, `product-service`, and `order-service`.

**Task**: Assign the following API routes to the correct target service:
1. `POST /api/register`
2. `GET /api/catalog/shoes`
3. `POST /api/checkout`
4. `GET /api/profile`
5. `GET /api/inventory/status`
6. `GET /api/history` (User's past purchases)

---

## Exercise 3: Sync vs Async Decision Matrix
**Scenario**: You need to design the communication between services.

**Task**: For each operation, decide if a Synchronous REST/gRPC call or an Asynchronous Message Queue is more appropriate, and explain why.
1. Checking if an item is in stock during checkout.
2. Generating a monthly PDF invoice for a user.
3. Updating a user's password.
4. Recommending products based on a recent purchase.
5. Sending a "Welcome" email after registration.
6. Processing a payment with Stripe.

---

## Exercise 4: Spot the Anti-Pattern
**Task**: Read the system descriptions below and identify what anti-pattern is present (e.g., Distributed Monolith, Missing API Gateway, Shared Database, Lack of Circuit Breaker).

1. "We have 10 microservices. Whenever the front-end needs to display the dashboard, it makes 10 separate API calls from the browser directly to each service's IP address."
2. "Our microservices are totally independent! Though, they do all connect to `main_db.postgres.us-east.rds` to read and write their tables."
3. "We deploy every Tuesday. All 8 microservice teams must merge their code to master by Monday, and we run a script that deploys all 8 containers at exactly the same time."
4. "The Order Service calls the Inventory Service synchronously. Yesterday, the Inventory Service went offline for 10 minutes. The Order Service kept trying to connect and eventually crashed from memory exhaustion because all its threads were waiting for timeouts."

---

## 📋 Answer Key & Model Solutions

### Exercise 1: Monolith Decomposition Model Answer

**Recommended Service Boundaries for the Social Media App:**
- **User Service**: Authentication, profiles, follower graph → PostgreSQL
- **Post Service**: Feed creation, post CRUD, media references → PostgreSQL + S3
- **Media Service**: Image/video uploads, compression, CDN delivery → S3 + MongoDB (metadata)
- **Notification Service**: Push/email/SMS delivery → Redis queues + external SMTP
- **Search Service**: User/hashtag/post search → Elasticsearch
- **Analytics Service**: View counts, engagement metrics → ClickHouse (column-store)

**Why these boundaries?** Each service has its own data store, can be scaled independently (Search scales differently from Auth), and can be developed by separate teams.

### Exercise 2: Gateway Route Matching Model Answer

Correct gateway routing configuration:
```javascript
// Product catalog — high read traffic, cacheable
app.use('/products', cache('5 minutes'), proxy({ target: 'http://product-service:3002' }));
// Orders — must not be cached (real-time stock levels)
app.use('/orders', requireAuth, proxy({ target: 'http://order-service:3003' }));
// Payments — requires auth + rate limiting (anti-fraud)
app.use('/payments', requireAuth, rateLimit(10, '1m'), proxy({ target: 'http://payment-service:3004' }));
```

### Exercise 3: Sync vs Async Decision Model Answer

| Action | Pattern | Reasoning |
|--------|---------|----------|
| User requests order total | Synchronous REST | Real-time data needed immediately |
| Sending order confirmation email | Async Message Queue (RabbitMQ/SQS) | Not time-critical; email can be delayed |
| Updating inventory count | Async Event (Kafka) | Eventually consistent is acceptable; order service shouldn't wait |
| Processing payment | Synchronous REST + retry | Money movement must be confirmed before proceeding |

### Exercise 4: Anti-Pattern Identification Model Answer

Identified anti-patterns and fixes:
1. **Shared Database** → Each service must own its own schema/DB. Use events to sync data.
2. **Chatty Services** (Service A calls B calls C calls D synchronously) → Use BFF pattern or aggregation layer.
3. **Hardcoded Service URLs** → Use service discovery (Consul, K8s DNS) or environment variables.
4. **No Circuit Breaker** → Wrap all outbound HTTP calls with `opossum` circuit breaker.
