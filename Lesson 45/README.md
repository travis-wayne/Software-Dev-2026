# Lesson 45: Microservices Architecture & API Gateways

## 🎯 Learning Objectives
By the end of this session, students will:
- Understand monolithic vs microservices architectural trade-offs
- Explain the API Gateway pattern and its responsibilities
- Describe synchronous (REST/gRPC) and asynchronous (message queue) inter-service communication
- Apply resilience patterns: Circuit Breaker, Retry, Bulkhead
- Know WHEN to use microservices and when to stay with a monolith

## 📚 Prerequisites
- Lesson 39 (Next.js API Routes — serverless functions)
- Lesson 43 (Docker — containerization)
- Lesson 44 (Kubernetes — orchestration)

## 🗂️ Contents
| Folder | Description |
|--------|-------------|
| `notes/student_notes.md` | Complete student learning guide |
| `notes/tutor_notes.md` | Instructor guide with war stories & Q&A |
| `exercises/microservices_practice.md` | Hands-on decomposition exercises |
| `examples/microservices-gateway-demo/` | Working API Gateway + 3 microservices |
| `examples/microservices-lab/index.html` | Interactive 4-tab glassmorphism lab |

## 🚀 Quick Start (Demo)
```bash
cd examples/microservices-gateway-demo
pnpm install
pnpm dev   # Starts all 4 services concurrently
```
Open http://localhost:3009 for the API Gateway

## 🌐 Cloud Integration
The User Service supports Neon PostgreSQL when `DATABASE_URL` is set.
Without it, falls back to in-memory store.
