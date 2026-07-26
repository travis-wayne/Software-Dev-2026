# Exercises — Lesson 43: Docker Basics (Containers, Images, Dockerfile)
**Software-Dev-2026 Advanced DevOps & Containerization Practice**

Test your understanding of Docker containerization, Dockerfile optimization, layer caching, CLI lifecycle commands, and multi-container orchestration. Attempt each exercise before reviewing the provided solutions!

---

## 🛠️ Exercise 1: The Dockerfile Optimization Challenge

You have inherited a legacy Node.js Express application from a junior developer. Their `Dockerfile` builds successfully, but it takes over **4 minutes** to rebuild after editing a single line of JavaScript code, produces an image that is **1.4 GB** in size, and executes as the `root` superuser (a major security violation!).

Here is the legacy Dockerfile:
```dockerfile
# Legacy unoptimized Dockerfile
FROM node:18
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]
```

### Your Task:
Rewrite this Dockerfile into an optimized, production-ready version that meets the following criteria:
1. Uses a minimal Alpine Linux base image (`node:18-alpine`).
2. Optimizes **Layer Caching** so that editing JavaScript source files does NOT re-trigger package installations.
3. Uses `pnpm` (via Corepack or direct installation) as instructed by our course standards.
4. Executes the application as an unprivileged, non-root user (`USER node`).
5. Explicitly documents the working directory and network port.

---

### ✅ Solution to Exercise 1

```dockerfile
# Step 1: Use lightweight Alpine base image (~170MB vs ~900MB)
FROM node:18-alpine

# Step 2: Set standardized container working directory
WORKDIR /usr/src/app

# Step 3: Enable Corepack for pnpm support
RUN corepack enable

# Step 4: Copy ONLY dependency manifests first (Maximizes Layer Caching!)
# When source code changes, Docker hits cache on this step and skips dependency downloads!
COPY package.json pnpm-lock.yaml ./

# Step 5: Install dependencies cleanly using pnpm
RUN pnpm install --frozen-lockfile

# Step 6: Copy remaining application source code
COPY . .

# Step 7: Document container network listening port
EXPOSE 3000

# Step 8: Security Best Practice — Switch from 'root' to unprivileged 'node' user
USER node

# Step 9: Define default runtime execution command
CMD ["node", "server.js"]
```
* **Performance Gain**: Build time after editing code drops from **240 seconds down to ~0.3 seconds**, and final image size drops from **1.4 GB down to ~185 MB**!

---

## 🛡️ Exercise 2: Writing the Defensive `.dockerignore` File

You are preparing to build a Docker image for a full-stack Next.js web application. In your local project root, you have the following files and folders:
* `node_modules/` (650 MB of local macOS/Windows compiled binaries)
* `.env` (Contains your secret Neon PostgreSQL database password and Paystack API keys!)
* `.env.local` (Local secret override file)
* `.git/` (200 MB of git commit history and branch metadata)
* `error-2026-07-26.log` (Large crash debug logs)
* `README.md` and `docs/` (Project documentation)
* `src/` and `public/` (Actual web app code)

### Your Task:
Write a comprehensive `.dockerignore` file that prevents unwanted files, secrets, and local OS binaries from polluting your Docker build context. Explain what happens if you forget to exclude `.env` and `node_modules/`.

---

### ✅ Solution to Exercise 2

Create a file named `.dockerignore` in your root directory:
```
# Dependency folders (must be cleanly installed inside Linux container)
node_modules
.pnp
.pnp.js

# Git version control metadata
.git
.gitignore

# Environment variables & Secret API keys (MUST NOT be baked into images!)
.env
.env.*
!.env.example

# Debug logs and local OS crash files
*.log
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# Documentation and editor configurations
.vscode
.idea
*.md
docs/
coverage/
.next/
```
* **Why excluding `.env` is critical**: If `.env` is copied into a Docker image, anyone who pulls that image from Docker Hub can inspect its filesystem layers and extract your production database passwords and Stripe/Paystack secrets!
* **Why excluding `node_modules/` is critical**: Local `node_modules` are compiled for your laptop's OS (e.g., Windows x64 or macOS Apple Silicon). If copied into a Linux container, native C++ bindings (like `bcrypt` or `sharp`) will crash with `Exec format error`!

---

## 💻 Exercise 3: CLI Mastery — The Deployment Challenge

Your DevOps Lead gives you a compiled Docker image tagged as `ecommerce-api:v2.1` and asks you to deploy it as a background container on a staging server.

### Your Task:
Write the exact single-line `docker run` command required to satisfy ALL of the following staging deployment specifications:
1. Run the container in **detached background mode**.
2. Map the staging server's **host port 8080** to the container's internal listening **port 3000**.
3. Name the running container instance `staging-api-server`.
4. Pass an environment variable named `NODE_ENV` set to `staging`.
5. Automatically restart the container if it crashes or the physical server reboots (`--restart always`).

---

### ✅ Solution to Exercise 3

```bash
docker run -d \
  -p 8080:3000 \
  --name staging-api-server \
  -e NODE_ENV=staging \
  --restart always \
  ecommerce-api:v2.1
```
### Breakdown of Flags:
* `-d` (`--detach`): Runs container in the background and prints the container ID.
* `-p 8080:3000`: Binds **H**ost Port 8080 to **C**ontainer Port 3000.
* `--name staging-api-server`: Assigns a readable name instead of a random hash or adjective-noun combination (like `quirky_torvalds`).
* `-e NODE_ENV=staging`: Injects runtime environment variables.
* `--restart always`: Configures the Docker Engine daemon to automatically reboot this container upon failure or server restart.

---

## 🐞 Exercise 4: Container Debugging & Forensic Inspection

A production container named `payment-worker` has suddenly stopped responding to network requests. When you run `docker ps`, you see that the container is still running, but users report HTTP 500 errors.

### Your Task:
1. What Docker CLI command would you run to stream the last 50 lines of real-time console console logs from `payment-worker`?
2. What command would you run to open an interactive terminal shell (`sh` or `bash`) inside the running container so you can inspect filesystem permissions and running OS processes?
3. What command would you run to inspect the container's internal IP address, network bindings, and environment variables formatted as JSON?

---

### ✅ Solution to Exercise 4

1. **Stream real-time container logs (last 50 lines)**:
```bash
docker logs --tail 50 -f payment-worker
```
*(The `-f` flag tells Docker to follow/stream new logs continuously).*

2. **Open an interactive debugging shell inside the container**:
```bash
docker exec -it payment-worker sh
```
*(The `-it` flag stands for **i**nteractive and allocate a **t**ty pseudo-terminal. Once inside, you can run `ls`, `top`, or `cat /var/log/app.log`).*

3. **Inspect container low-level metadata and IP configurations**:
```bash
docker inspect payment-worker
```
*(To filter just the container's internal IP address using format syntax: `docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' payment-worker`).*

---

## 🐙 Exercise 5: Multi-Container Architecture with Docker Compose

You are designing a full-stack microservice architecture for a social media platform. Your backend requires three interacting services:
1. An Express API server (built from the local Dockerfile).
2. A PostgreSQL database container for user storage.
3. A Redis in-memory cache container for session tracking.

### Your Task:
Write a complete `docker-compose.yml` file that launches these three services. Ensure that:
* The Express API service binds to host port `4000` (mapped to container port `3000`) and waits for PostgreSQL to start before booting (`depends_on`).
* PostgreSQL uses a persistent named volume (`pg_data`) so database records survive container restarts!
* Redis binds to its default port `6379`.

---

### ✅ Solution to Exercise 5

```yaml
version: '3.8'

services:
  # 1. Express API Backend Service
  api-service:
    build: .
    container_name: social_api
    ports:
      - "4000:3000"
    environment:
      - PORT=3000
      - DATABASE_URL=postgresql://admin:secret123@postgres-db:5432/social_db
      - REDIS_HOST=redis-cache
      - REDIS_PORT=6379
    depends_on:
      - postgres-db
      - redis-cache
    restart: always

  # 2. PostgreSQL Relational Database Service
  postgres-db:
    image: postgres:15-alpine
    container_name: social_postgres
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secret123
      - POSTGRES_DB=social_db
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data
    restart: always

  # 3. Redis In-Memory Cache Service
  redis-cache:
    image: redis:7-alpine
    container_name: social_redis
    ports:
      - "6379:6379"
    restart: always

# Persistent Volume Declarations
volumes:
  pg_data:
```
* **Architectural Note**: Inside `api-service`, we connect to PostgreSQL using `postgres-db:5432` and Redis using `redis-cache:6379` because Docker Compose creates an isolated virtual bridge network where container service names automatically resolve as DNS hostnames!
