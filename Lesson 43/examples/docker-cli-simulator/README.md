# Lesson 43: Standalone Offline Docker CLI Simulator
**Software-Dev-2026 Curriculum**

This project provides an offline simulation of the Docker Engine daemon (`dockerd`) and command-line interface (`docker`). It allows students to practice Docker CLI syntax, inspect UnionFS image layers, and manage container lifecycles without requiring Docker Desktop to be installed on their host machine!

---

## 🚀 Quickstart Guide
Run this simulator locally using `pnpm`:
```bash
pnpm install
pnpm dev
```
* Simulator API Server: `http://localhost:3006`
* Check available images: `http://localhost:3006/api/images`
* Check running containers: `http://localhost:3006/api/containers`

---

## 🧪 How to Test CLI Execution
You can send simulated Docker commands to `/api/exec` via Postman, curl, or our interactive lab UI:

### Example 1: Check Running Containers
```bash
curl -X POST http://localhost:3006/api/exec \
  -H "Content-Type: application/json" \
  -d '{"command": "docker ps"}'
```

### Example 2: Run a Detached Container with Port Mapping
```bash
curl -X POST http://localhost:3006/api/exec \
  -H "Content-Type: application/json" \
  -d '{"command": "docker run -d -p 8080:3000 --name my-test-api node:18-alpine"}'
```

### Example 3: Simulate a Docker Build with Layer Caching
```bash
curl -X POST http://localhost:3006/api/exec \
  -H "Content-Type: application/json" \
  -d '{"command": "docker build -t custom-node-app:v1 ."}'
```
