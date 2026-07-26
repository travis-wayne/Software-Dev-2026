# Student Notes — Session 43: Docker Basics (Containers, Images, Dockerfile)
**Modern DevOps & Containerization Reference Guide**

---

## 📖 Topics Covered
1. **The Containerization Revolution**: Why traditional virtual machines (VMs) are too heavy and how Docker containers solve "it works on my machine" deployment failures.
2. **Core Docker Architecture**: The Docker Engine (Daemon, REST API, CLI), Docker Hub registries, Images (read-only blueprints), and Containers (live execution units).
3. **Anatomy of a Production Dockerfile**: Mastering instructions (`FROM`, `WORKDIR`, `COPY`, `RUN`, `EXPOSE`, `USER`, `CMD`) and build layer optimization.
4. **Essential Docker CLI Commands**: Managing container lifecycles (`docker build`, `docker run -p -d`, `docker ps`, `docker exec -it`, `docker logs`).
5. **Multi-Stage Builds & `.dockerignore`**: Writing ultra-lean production images by stripping out build tools and local dev artifacts.
6. **Docker Compose Basics**: Orchestrating multi-container applications (e.g., connecting a Node.js API to a database container).

---

## 🏗️ 1. Containers vs. Virtual Machines (Why VMs Are Too Heavy)

For decades, the standard way to isolate software on a server was a **Virtual Machine (VM)**. A physical server ran a hypervisor (like VMware or VirtualBox) that carved up the CPU and RAM into virtual computers. However, every VM required booting an **entire Guest Operating System** (e.g., a full Windows or Ubuntu Linux OS taking up 4GB of RAM and dozens of gigabytes of disk space) just to run a small web server!

**Docker Containers** take a revolutionary approach: instead of virtualizing the hardware to run multiple operating systems, Docker **virtualizes the operating system itself**!

```
     TRADITIONAL VIRTUAL MACHINES (VMs)                 DOCKER CONTAINERIZATION
+------------------------------------------+  +------------------------------------------+
|  [App A]      [App B]      [App C]       |  |  [App A]      [App B]      [App C]       |
|  [Bin/Lib]    [Bin/Lib]    [Bin/Lib]     |  |  [Bin/Lib]    [Bin/Lib]    [Bin/Lib]     |
| +----------+ +----------+ +----------+   |  | +--------------------------------------+ |
| | Guest OS | | Guest OS | | Guest OS |   |  | |      Docker Engine (Containerized)   | |
| +----------+ +----------+ +----------+   |  | +--------------------------------------+ |
| |        Hypervisor (VMware/VBox)      | |  | |        Host Operating System         | |
| +--------------------------------------+ |  | +--------------------------------------+ |
| |           Physical Server            | |  | |           Physical Server            | |
+------------------------------------------+  +------------------------------------------+
```

### Key Differences:
* **Boot Time**: VMs take **minutes** to boot an OS kernel; Docker containers boot in **milliseconds** because the host OS kernel is already running!
* **Resource Consumption**: VMs reserve fixed blocks of RAM (e.g., 4GB each); Docker containers share the host RAM dynamically and consume only what the application actually uses (often <50MB).
* **Isolation Mechanism**: Docker uses Linux **Namespaces** (to isolate process IDs, networking, and filesystems) and **cgroups** (to limit CPU and memory usage) so containers cannot interfere with each other or the host.

---

## 🧩 2. Core Docker Terminology

* **Docker Engine**: The core client-server application that powers Docker. It consists of a background **Daemon process (`dockerd`)** that manages containers and images, a REST API, and the command-line interface (**CLI (`docker`)**).
* **Docker Image**: A read-only, immutable template or blueprint used to create containers. An image consists of stacked filesystem layers built from written instructions in a Dockerfile.
* **Docker Container**: A live, running instance of an image in computer memory! You can launch 100 identical containers from a single image. When a container starts, Docker adds a thin writable layer on top of the read-only image layers.
* **Dockerfile**: A plain-text configuration file containing step-by-step instructions (`FROM`, `COPY`, `RUN`) telling the Docker Engine how to assemble an image.
* **Docker Hub**: The public cloud registry (`hub.docker.com`) where developers share and download pre-built base images (e.g., official Node.js, PostgreSQL, Nginx, or Redis images).

---

## 📜 3. Anatomy of a Production Dockerfile

Let's examine a production-grade Dockerfile for a Node.js web API:

```dockerfile
# Step 1: Specify a minimal base image (Alpine Linux is ~5MB instead of ~200MB for Debian)
FROM node:18-alpine

# Step 2: Set the working directory inside the container filesystem
WORKDIR /usr/src/app

# Step 3: Copy ONLY dependency manifests first (to maximize Layer Caching!)
COPY package.json pnpm-lock.yaml ./

# Step 4: Install package manager and project dependencies
RUN corepack enable && pnpm install --frozen-lockfile

# Step 5: Copy the remaining source code into the container
COPY . .

# Step 6: Document which network port the container will listen on
EXPOSE 3000

# Step 7: Security Best Practice — Switch from 'root' to an unprivileged user
USER node

# Step 8: Define the primary command executed when a container boots
CMD ["node", "src/server.js"]
```

### Why Order Matters: The Layer Caching Secret!
Every line in a Dockerfile creates a cached **Layer**. When you re-run `docker build`, Docker checks if any files in that layer changed.
* By copying `package.json` and running `pnpm install` **before** copying your source code (`COPY . .`), Docker caches the downloaded packages!
* When you edit a JavaScript source file, Docker re-uses the cached dependency layer in milliseconds and only rebuilds the tiny source code layer!

---

## 🛡️ 4. The Mandatory `.dockerignore` File

Just as `.gitignore` prevents secret and junk files from entering GitHub, `.dockerignore` prevents files from being copied into your Docker build context!

Always create a `.dockerignore` in your project root:
```
node_modules
.git
.gitignore
.env
*.log
Dockerfile
docker-compose.yml
npm-debug.log*
coverage
.vscode
```
> [!WARNING]
> **Without a `.dockerignore` file**, Docker will copy your entire local `node_modules/` folder (often 500MB+) and your secret `.env` API keys into your Docker image! This causes 5-minute build times and catastrophic security leaks!

---

## ⚡ 5. Essential Docker CLI Command Reference

| Command | Purpose | Example Usage |
| :--- | :--- | :--- |
| `docker build -t <name> .` | Builds a Docker image from a Dockerfile in the current directory (`.`) and tags (`-t`) it with a name. | `docker build -t my-node-api .` |
| `docker run -d -p <H>:<C> <img` | Runs a container in detached background mode (`-d`) and maps Host Port `<H>` to Container Port `<C>` (`-p`). | `docker run -d -p 8080:3000 --name api-server my-node-api` |
| `docker ps` | Lists all currently running containers (add `-a` to see stopped containers too). | `docker ps -a` |
| `docker exec -it <id> sh` | Opens an interactive terminal shell (`-it`) inside a running container for debugging! | `docker exec -it api-server sh` |
| `docker logs -f <id>` | Streams (`-f` follow) real-time console logs outputted by a container's PID 1 process. | `docker logs -f api-server` |
| `docker stop <id>` | Gracefully stops a running container by sending a SIGTERM signal. | `docker stop api-server` |
| `docker rm <id>` | Removes a stopped container from disk (use `docker rmi <img` to remove an image). | `docker rm api-server` |

---

## 🚀 6. Multi-Stage Builds (For TypeScript & Next.js)

When building complex frontend or TypeScript apps, you need heavy compilers (`tsc`, Next.js build tools) that can bloat an image to 1GB+. **Multi-Stage Builds** allow you to use a heavy "builder" stage to compile your code, and then copy **only the compiled output** into a tiny, pristine "runner" stage!

```dockerfile
# === STAGE 1: The Builder Stage (Heavy tools) ===
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install
COPY . .
RUN pnpm build   # Compiles TypeScript / Next.js to /dist

# === STAGE 2: The Production Runner Stage (Tiny & Secure) ===
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
USER node
CMD ["node", "dist/server.js"]
```
* **Result**: Your final Docker image size shrinks from **1.2 GB down to ~60 MB** because all build-time dependencies and compilers are left behind in Stage 1!

---

## 🐙 7. Orchestrating with Docker Compose

When building real-world applications, your Node.js server needs to communicate with external databases (PostgreSQL, MongoDB) or caches (Redis). Instead of running dozens of manual `docker run` commands in terminal, we use **Docker Compose** (`docker-compose.yml`) to define and launch entire multi-container architectures with a single command: `docker compose up -d`!

```yaml
version: '3.8'

services:
  # 1. Our Node.js Express API
  api:
    build: .
    ports:
      - "8080:3000"
    environment:
      - PORT=3000
      - DATABASE_URL=postgresql://postgres:secret@db:5432/app_db
    depends_on:
      - db
    restart: always

  # 2. Local PostgreSQL Database Container
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=app_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```
* Notice how our API connects to PostgreSQL using the service hostname `db:5432` instead of `localhost`! In Docker Compose, service names automatically act as DNS hostnames on an isolated internal network!

---

## ☁️ 11. Connecting Your Container to a Real Cloud Database

This is a CRITICAL real-world distinction: in local development, we use a PostgreSQL container in docker-compose. In PRODUCTION, you should NEVER run your database inside a Docker container on the same server as your app. Use a managed cloud DB (Neon, Supabase, Railway) instead.

Explain WHY this matters:
- Database containers don't survive `docker rm -v` (data loss risk)
- Named volumes on a single server = no automatic backups, no failover
- Managed cloud DBs: automated daily backups, point-in-time recovery, multi-region failover, connection pooling
- Your app container becomes stateless — it can be killed and recreated any time without data loss

Show the three ways to pass a cloud DATABASE_URL to a running container:

1. Runtime flag: `docker run -e DATABASE_URL="postgresql://..." my-api`
2. Env file: `docker run --env-file .env.production my-api`
3. Docker Compose env_file:
```yaml
services:
  api:
    image: my-api:latest
    env_file:
      - .env.production   # Contains DATABASE_URL=postgresql://neon.tech/...
```

> [!TIP]
> **Pro tip:** Your Dockerfile should NEVER contain DATABASE_URL! It should come from runtime environment variables so the same image can connect to dev, staging, or production databases.

---

## ⚖️ 12. Docker in Development vs Production — The Key Differences

| Concern | Development (docker-compose) | Production (Cloud deployment) |
|---------|------------------------------|-------------------------------|
| Database | PostgreSQL container + named volume | Managed cloud DB (Neon/Supabase/RDS) |
| Secrets | .env file (gitignored) | Environment variables via Kubernetes Secrets / Vercel env vars |
| Image registry | Local Docker daemon | Docker Hub / GitHub Container Registry |
| Scaling | Single machine | Kubernetes / ECS auto-scaling |
| SSL/TLS | Not needed locally | Cloud load balancer terminates TLS |
| Logging | docker logs (local terminal) | CloudWatch / Datadog / Grafana |

---

## 📝 Activities & Exercises
1. **Pre-Session**: Install Docker Desktop on Windows/macOS or Docker Engine on Linux. Open terminal and verify by running `docker --version` and `docker run hello-world`.
2. **In-Session Lab**: Open our interactive **Lesson 43 Glassmorphism Lab** (`examples/docker-simulator-lab/index.html`) in your browser! Experiment with the Dockerfile Layer Caching Simulator, test your Dockerfile syntax against our live performance linter, and practice Docker CLI commands in the lifecycle workbench.
3. **Post-Session Homework**:
   * Containerize your E-commerce backend API or personal portfolio using a Multi-Stage Alpine Dockerfile.
   * Write a `.dockerignore` file to ensure your `node_modules/` folder is never uploaded to the build context.
   * Complete all 5 exercises in `exercises/docker_basics_practice.md`.
