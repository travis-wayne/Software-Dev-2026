# Lesson 44 Example: Containerized Express CI/CD Microservice

This demonstration project provides a containerized Express microservice engineered specifically for automated GitHub Actions build pipelines and Kubernetes cluster telemetry.

## ✨ Features
* **OS & Container Telemetry**: Automatically checks Linux cgroup and filesystem flags (`/.dockerenv`) to determine if it is running inside an isolated Docker container or a Kubernetes pod.
* **Build Argument Injection**: Accepts `GIT_SHA` and `BUILD_DATE` at container compile time via `Dockerfile` build arguments (`ARG`), exposing them on `GET /api/telemetry` for GitOps rollback verification!
* **Automated K8s Probes**: Provides `GET /api/health` designed as an automated Kubernetes Liveness Probe endpoint.
* **Production Reusable CI/CD Workflows**: Contains fully documented GitHub Actions YAML templates in `.github-workflows-sample/` for both **Docker Hub** and **GitHub Container Registry (GHCR)**.

## 🚀 Local Running & Testing
```bash
# Install dependencies strictly using pnpm
pnpm install

# Start local dev server
pnpm dev
```
Test endpoints:
* `http://localhost:3007/` -> Welcoming index
* `http://localhost:3007/api/telemetry` -> View build tags and container metadata
* `http://localhost:3007/api/health` -> Test liveness probe

## 🐳 Building with Docker CLI Locally
```bash
docker build --build-arg GIT_SHA="local-sha-123" -t cicd-demo-api .
docker run -p 3007:3007 cicd-demo-api
```
