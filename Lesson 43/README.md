# Lesson 43 — Cloud & Advanced Topics: Docker Basics (Containers, Images, Dockerfile)
**Software-Dev-2026 Curriculum**

Welcome to **Lesson 43**! In this module, you will master **Containerization** with **Docker**, the industry standard for packaging applications, dependencies, and system configurations into lightweight, portable, and isolated execution units. Say goodbye to *"it works on my machine"* syndrome!

---

## 🎯 Learning Objectives

By the end of this session, you will be able to:
1. **Differentiate Containers vs. Virtual Machines**: Understand how Docker shares the host operating system kernel via Linux namespaces and cgroups, eliminating hypervisor overhead and booting in milliseconds rather than minutes.
2. **Master Dockerfile Best Practices**: Write optimized, production-ready Dockerfiles utilizing **Multi-Stage Builds**, Alpine Linux minimal base images, non-root user execution, `.dockerignore` filtering, and optimal instruction ordering to maximize build layer caching.
3. **Command the Docker CLI**: Confidently build images (`docker build`), run isolated containers with port mapping (`docker run -p 8080:3000`), inspect running processes (`docker ps`, `docker exec -it`), and debug container logs (`docker logs`).
4. **Orchestrate with Docker Compose**: Structure multi-container environments (`docker-compose.yml`) connecting Node.js backend services to external databases and caches.
5. **Develop Offline with Dual-Mode Simulators**: Test container lifecycles, build layer caching, and Dockerfile linting locally using our interactive zero-setup Docker CLI simulator even without Docker Desktop installed!

---

## 📂 Folder Structure

```
Lesson 43/
├── README.md                              # This module overview
├── notes/
│   ├── tutor_notes.md                     # Teaching guide, maritime analogies, layer caching deep-dive & gotchas
│   └── student_notes.md                   # Comprehensive student reference on Docker Engine, CLI, Dockerfiles & Compose
├── exercises/
│   └── docker_basics_practice.md          # 5 practical exercises on multi-stage builds, CLI commands, and container debugging
└── examples/
    ├── node-docker-demo/                  # Runnable Express API configured with production Dockerfile & docker-compose.yml
    ├── docker-cli-simulator/              # Standalone Node.js Docker Engine & CLI simulator for offline container testing
    └── docker-simulator-lab/
        └── index.html                     # 4-tab interactive dark glassmorphism lab (Layer cacher, Dockerfile linter & terminal)
```

---

## 🚀 Quickstart Guide

All demonstration projects in Lesson 43 are built with **Dual-Mode Simulators**, allowing you to test Docker builds, container orchestration, and Dockerfile optimization **instantly offline** out of the box!

### 1. Test the Node.js Docker Demo Project
An Express API optimized for containerization that reports internal container OS metrics and environment variables:
```bash
cd examples/node-docker-demo
pnpm install
pnpm dev
```
* API Server running locally at: `http://localhost:3005`
* Inspect container/host runtime telemetry: `http://localhost:3005/api/info`

#### Running with Real Docker Desktop (Optional):
If you have Docker Desktop running:
```bash
docker build -t node-docker-demo .
docker run -d -p 8080:3000 --name my-app node-docker-demo
```
* Access containerized server at: `http://localhost:8080/api/info`

### 2. Test the Standalone Docker CLI & Engine Simulator
Simulates image layer building, container ID generation, port binding, and process inspection without needing Docker installed:
```bash
cd ../docker-cli-simulator
pnpm install
pnpm dev
```
* Simulator API & Engine running at: `http://localhost:3006`
* Execute simulated Docker CLI commands: `http://localhost:3006/api/exec?cmd=docker+ps`

### 3. Launch the Interactive Docker Lab
Open `examples/docker-simulator-lab/index.html` directly in any web browser to explore the **Container vs VM Layer Visualizer**, test live **Dockerfile linter grading**, execute commands in the **Docker Lifecycle Terminal**, and take the **Mastery Quiz**!
