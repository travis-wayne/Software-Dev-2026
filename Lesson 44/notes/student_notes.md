# Student Notes — Session 44: Advanced CI/CD (Docker in CI/CD, Kubernetes Intro)
**Industrial-Grade Automated Deployment & Container Orchestration Reference Guide**

---

## 📖 Topics Covered
1. **The Containerized CI/CD Revolution**: Why building Docker images inside automated pipelines eliminates runtime server drift and dependency corruption.
2. **Container Image Registries**: Storing and distributing immutable images via Docker Hub (`docker.io`) and GitHub Container Registry (`ghcr.io`).
3. **Anatomy of a Docker CI/CD Workflow**: Writing production GitHub Actions (`docker/login-action`, `docker/build-push-action`) and multi-tagging strategies (`latest` vs `${{ github.sha }}`).
4. **Introduction to Kubernetes (K8s)**: Why managing raw Docker containers fails at scale and how container orchestration automates deployments, self-healing, and networking.
5. **Kubernetes Cluster Architecture**: The Control Plane (API Server, Scheduler) vs. Worker Nodes (Kubelet, Pods).
6. **Declarative K8s Manifests**: Mastering Kubernetes YAML resources (`Deployment`, `Service`, `ConfigMap`, `Secret`).

---

## 🔄 1. Why Docker Containers Supercharge CI/CD

In earlier sessions, our CI/CD pipelines deployed applications by cloning source code directly onto a staging or production server and running `npm install`. While effective for simple apps, this approach introduces serious vulnerabilities at scale:
* **Environment Drift**: What if the staging server runs Node.js 18.12 while production runs Node.js 18.19? Subtle OS-level differences can cause crashes!
* **Network Vulnerability**: What if `npmjs.com` goes down during your deployment? Your production server fails to install dependencies and stops working!

**The Containerized CI/CD Solution**:
Instead of shipping raw source code to your servers, your **GitHub Actions pipeline** builds a sealed, immutable **Docker Image** during the CI build phase. This image bundles your exact Node.js runtime, compiled code, and locked dependencies into a standardized artifact. The pipeline publishes this image to a **Container Registry**. Your production servers never run `npm install`—they simply download the sealed Docker image and boot it in milliseconds!

```
[Developer Git Push] ---> [GitHub Actions CI/CD Pipeline]
                                  │
                                  ├─ 1. Checkout Code & Run Unit Tests
                                  ├─ 2. Build Docker Image (Dockerfile)
                                  ├─ 3. Tag with Commit SHA (v1.0-a8f9c2d)
                                  └─ 4. Push to Registry (Docker Hub / GHCR)
                                               │
                                               ▼
                         [Container Registry (hub.docker.com / ghcr.io)]
                                               │
                                               ▼ (kubectl apply / auto-pull)
                         [Kubernetes Production Cluster (Worker Nodes)]
```

---

## 📦 2. Docker Hub vs. GitHub Container Registry (GHCR)

To share Docker images between your CI/CD pipeline and your production servers, you need a **Container Registry**. Two industry leaders dominate:

| Feature / Metric | Docker Hub (`hub.docker.com`) | GitHub Container Registry (`ghcr.io`) |
| :--- | :--- | :--- |
| **Default Domain** | `docker.io/username/image:tag` | `ghcr.io/owner/repository:tag` |
| **Authentication** | Requires creating a Personal Access Token (PAT) in account settings and saving it as a GitHub Secret (`DOCKERHUB_TOKEN`). | **Zero Setup!** Natively integrated into GitHub Actions using the automatic `${{ secrets.GITHUB_TOKEN }}`! |
| **Public Repository Cost** | Free unlimited public repositories (subject to anonymous pull rate limits). | Free unlimited public packages and anonymous downloads. |
| **Best Use Case** | When deploying to external cloud providers (AWS ECS, Heroku, DigitalOcean) that default to Docker Hub. | When your source code is hosted on GitHub and you want unified billing, IAM permissions, and zero-secret management. |

---

## 📜 3. Anatomy of a Production Docker GitHub Action

Let's examine a production-ready GitHub Actions workflow (`.github/workflows/docker-publish.yml`) that builds and publishes a Docker image to GitHub Container Registry upon every push to the `main` branch:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ "main" ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write   # Required to allow GITHUB_TOKEN to push to GHCR!

    steps:
      # 1. Checkout repository source code
      - name: Checkout repository
        uses: actions/checkout@v4

      # 2. Set up Docker Buildx (Enables multi-architecture builds & layer caching)
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      # 3. Log in to GitHub Container Registry using automatic token
      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # 4. Extract Docker tags & labels (Generates both :latest and :<git-sha>)
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=raw,value=latest
            type=sha,format=short

      # 5. Build and push immutable image
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

> [!IMPORTANT]
> **Why we use `cache-from: type=gha`**: Notice the last two lines! By instructing Docker Buildx to use **GitHub Actions Cache (`gha`)**, your pipeline stores UnionFS build layers directly in GitHub's cloud cache. When you edit a single line of JavaScript, your CI build finishes in **10 seconds** instead of 3 minutes because `pnpm install` is restored from GitHub's cache!

---

## ☸️ 4. Introduction to Kubernetes (Why We Need Orchestration)

Running `docker run -p 8080:3000 my-app` works wonderfully on a single developer laptop. But what happens when your web application goes viral and needs to serve **100,000 requests per second** across 20 physical cloud servers?
* How do you launch 50 identical copies of your container across different machines?
* What happens if Server #4 experiences a hardware failure or power outage? Who restarts those containers on Server #5?
* How do you distribute incoming user HTTP traffic evenly across all 50 containers?

**Kubernetes (K8s)** is an open-source **Container Orchestration System** originally developed by Google. It acts as an automated operating system for your entire cluster of servers, automating deployment, scaling, self-healing, and networking!

---

## 🏗️ 5. Kubernetes Cluster Architecture

A Kubernetes cluster is divided into two distinct components: the **Control Plane** (the brain) and the **Worker Nodes** (the muscle).

```
+-------------------------------------------------------------------------------+
|                       KUBERNETES CONTROL PLANE (MASTER)                       |
|  +-------------------+  +---------------------+  +-------------------------+  |
|  |    API Server     |  |      Scheduler      |  |   Controller Manager    |  |
|  |  (REST Endpoint)  |  |  (Assigns Pods)     |  |  (Self-Healing Loops)   |  |
|  +-------------------+  +---------------------+  +-------------------------+  |
|                               +-------------------+                           |
|                               |  etcd (State DB)  |                           |
|                               +-------------------+                           |
+---------------------------------------+---------------------------------------+
                                        │ (Kubelet API Communication)
         ┌──────────────────────────────┴──────────────────────────────┐
         ▼                                                             ▼
+------------------------------------+       +------------------------------------+
|           WORKER NODE 1            |       |           WORKER NODE 2            |
|  +------------------------------+  |       |  +------------------------------+  |
|  |  Kubelet (Node Agent)        |  |       |  |  Kubelet (Node Agent)        |  |
|  +------------------------------+  |       |  +------------------------------+  |
|  |  [Pod: Express API Replica 1]|  |       |  |  [Pod: Express API Replica 2]|  |
|  |  [Pod: Express API Replica 3]|  |       |  |  [Pod: Redis Cache]          |  |
|  +------------------------------+  |       |  +------------------------------+  |
|  |  Kube-Proxy (Networking)     |  |       |  |  Kube-Proxy (Networking)     |  |
|  +------------------------------+  |       |  +------------------------------+  |
+------------------------------------+       +------------------------------------+
```

### Key Architectural Concepts:
* **Pod**: The smallest deployable unit in Kubernetes. A Pod is a logical wrapper around one (or sometimes more) Docker containers that share an IP address and disk volumes.
* **Kubelet**: The software agent running on every Worker Node. It listens to instructions from the Master API Server and ensures Docker containers are running inside their assigned Pods.
* **Controller Manager & Self-Healing**: A background control loop that constantly compares the *current physical state* of the cluster against your *desired YAML configuration*. If you asked for 3 replicas and a Worker Node crashes, the Controller Manager instantly commands Kubelet on another node to boot a replacement Pod!

---

## 📜 6. Declarative K8s Manifests (Deployments & Services)

In Kubernetes, you rarely run imperative commands like `kubectl run`. Instead, you write **Declarative YAML Manifests** that describe your desired architecture, and apply them using `kubectl apply -f manifest.yaml`.

### A. The Deployment Manifest (`deployment.yaml`)
A **Deployment** manages a replicated cluster of Pods, handling automated rolling updates and self-healing:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: express-api-deployment
  labels:
    app: express-api
spec:
  replicas: 3                    # Desired State: Always keep exactly 3 Pods running!
  selector:
    matchLabels:
      app: express-api           # Tells Deployment which Pods it owns and supervises
  template:
    metadata:
      labels:
        app: express-api         # Labels attached to every booted Pod
    spec:
      containers:
        - name: api-container
          image: ghcr.io/myuser/my-api:v1.0-a8f9c2d  # Pulls our CI/CD immutable image!
          ports:
            - containerPort: 3000
          env:
            - name: PORT
              value: "3000"
          resources:
            limits:
              memory: "256Mi"
              cpu: "500m"
          livenessProbe:         # Automated health check: restarts Pod if HTTP fails!
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
```

### B. The Service Manifest (`service.yaml`)
By default, Pods are ephemeral—when a Pod is self-healed or replaced, its internal IP address changes! A **Service** provides a permanent, unchanging IP address and DNS hostname, automatically load-balancing incoming traffic across all healthy replica Pods matching its label selector:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: express-api-loadbalancer
spec:
  type: LoadBalancer             # Requests an external public IP from AWS/GCP/Azure
  selector:
    app: express-api             # Routes traffic to ANY healthy Pod with this label!
  ports:
    - protocol: TCP
      port: 80                   # External listening port (e.g., http://my-domain.com:80)
      targetPort: 3000           # Internal container port where Express is listening
```

---

## 📝 Activities & Exercises
1. **Pre-Session**: Verify your GitHub account and ensure you have an existing Dockerized Node.js project.
2. **In-Session Lab**: Open our interactive **Lesson 44 Advanced CI/CD & Kubernetes Lab** (`examples/cicd-k8s-lab/index.html`) in your web browser!
   * Run the **CI/CD Pipeline Visualizer** to see how Docker Buildx caches layers in GitHub Actions.
   * Switch to the **Kubernetes Cluster Orchestrator**! Scale replica counts from 3 up to 8, simulate real-world traffic load balancing, and click **"💥 Sim Pod Crash"** to witness Kubernetes instantaneous self-healing!
   * Practice validating YAML syntax in the Manifest Inspector.
3. **Post-Session Homework**:
   * Complete all 5 exercises in `exercises/advanced_cicd_practice.md`.
   * Configure a `.github/workflows/docker-publish.yml` file in your repository to automatically build and push an image to GHCR upon merging to `main`.
