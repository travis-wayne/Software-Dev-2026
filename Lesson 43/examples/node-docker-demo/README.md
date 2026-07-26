# Lesson 43: Containerized Node.js Express Demo Project
**Software-Dev-2026 Curriculum**

This demonstration project illustrates modern containerization best practices using an Alpine Linux multi-stage Dockerfile, optimized layer caching, `.dockerignore` security filtering, and multi-container orchestration via Docker Compose.

---

## 🚀 How to Run (Two Methods)

### Method 1: Local Development (Without Docker)
You can run this Express API directly on your host machine to test its telemetry endpoints:
```bash
pnpm install
pnpm dev
```
* API Server: `http://localhost:3005`
* Check telemetry: `http://localhost:3005/api/info` (Will report `isContainerized: false`)

---

### Method 2: Docker Containerization (With Docker Desktop)

#### Step 1: Build the Docker Image
Notice how fast subsequent builds are due to our optimized `COPY package.json` layer order:
```bash
docker build -t node-docker-demo:v1 .
```

#### Step 2: Run an Isolated Container Instance
Map your laptop's host port 8080 to the container's internal listening port 3000:
```bash
docker run -d -p 8080:3000 --name my-api-server node-docker-demo:v1
```
* Access containerized server at: `http://localhost:8080/api/info`
* You will now see `isContainerized: true` and the container's short ID as the hostname!

#### Step 3: Run with Docker Compose (Multi-Container Architecture)
To launch both the Express API and a connected Redis in-memory cache service simultaneously:
```bash
docker compose up -d
```
* View running container logs: `docker compose logs -f`
* Stop and remove containers: `docker compose down`

---

## 🔬 What to Inspect
1. **Dockerfile Layer Caching**: Edit a comment in `src/server.js` and re-run `docker build -t node-docker-demo:v1 .`. Notice that Step 1-5 (pnpm install) report `CACHED` in 0.01s!
2. **Security Checks**: Enter the container shell using `docker exec -it my-api-server sh` and run `whoami`. It will output `node` instead of `root`!
3. **Liveness Probe**: Test the automated Docker health endpoint at `http://localhost:8080/api/health`.
