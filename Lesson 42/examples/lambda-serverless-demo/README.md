# Lesson 42 — AWS Lambda Serverless Handlers & API Gateway Simulator
**Software-Dev-2026 Curriculum**

This project demonstrates how to write standalone event-driven **AWS Lambda** functions (`quoteHandler.js` and `imageMetadataHandler.js`) that execute in response to API Gateway HTTP requests or S3 bucket events.

## 🟢 Local Runtime Simulator & Cold Start Demo
Because Lambda functions export a raw `async (event, context)` handler rather than starting an Express server, this project includes a local runtime simulator (`src/server.js`) that mimics AWS API Gateway and S3 event payloads.

It also simulates **Cold Start Latency**! The first invocation of a handler takes ~1 second as simulated micro-containers provision. Immediate subsequent invocations execute in ~15ms as "warm starts"!

---

## 🚀 Running the Project

```bash
# 1. Install dependencies strictly using pnpm
pnpm install

# 2. Start the simulator server
pnpm dev
```
The server will start on `http://localhost:3004`.

---

## 🧪 Testing Serverless Endpoints

### 1. Check Container Warm/Cold Status
```bash
curl http://localhost:3004/api/status
```

### 2. Invoke the Quote Lambda via Simulated API Gateway
```bash
# Notice the first call is a cold start (~1000ms), and second call is a warm start (~15ms)!
curl "http://localhost:3004/api/quote?category=tech"
```

### 3. Simulate an Asynchronous S3 Upload Trigger
```bash
curl -X POST http://localhost:3004/api/simulate-s3-event \
  -H "Content-Type: application/json" \
  -d '{"bucket": "shop-media-prod", "key": "avatars/alice-high-res.png", "size": 512000}'
```
