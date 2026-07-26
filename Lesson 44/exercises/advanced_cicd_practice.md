# Exercises — Lesson 44: Advanced CI/CD (Docker in CI/CD, Kubernetes Intro)
**Software-Dev-2026 Industrial DevOps & Orchestration Practice**

Test your mastery of automated container pipelines, GitHub Actions Docker Buildx integration, container registry security, Kubernetes YAML manifests, and cluster crash forensics. Attempt each exercise before reviewing the provided solutions!

---

## 🚀 Exercise 1: The Docker Hub CI/CD Pipeline Challenge

You are tasked with automating the deployment pipeline for an E-commerce backend API. Currently, developers build Docker images manually on their laptops and push them to Docker Hub. This has led to inconsistent image builds and untraceable production bugs.

### Your Task:
Write a complete GitHub Actions workflow YAML file (`.github/workflows/docker-hub-ci.yml`) that automates this process. The workflow must satisfy ALL of the following specifications:
1. Trigger automatically whenever a developer pushes commits to the `main` branch or creates a release tag starting with `v*` (e.g., `v1.0.2`).
2. Run on an `ubuntu-latest` runner runner environment.
3. Check out the repository code and configure **Docker Buildx** to enable layer caching.
4. Log in to Docker Hub using GitHub repository secrets named `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`.
5. Build the image and tag it with **BOTH** the string `latest` and the short **Git Commit SHA** (`${{ github.sha }}`) to ensure GitOps rollback traceability.
6. Enable GitHub Actions layer cache export (`type=gha`) so subsequent builds finish in under 15 seconds.

---

### ✅ Solution to Exercise 1

```yaml
name: Build and Publish to Docker Hub

on:
  push:
    branches:
      - main
    tags:
      - 'v*'

jobs:
  docker-publish:
    name: Build & Publish Container Image
    runs-on: ubuntu-latest

    steps:
      # Step 1: Checkout repository source code
      - name: Checkout repository
        uses: actions/checkout@v4

      # Step 2: Enable Docker Buildx for advanced layer caching
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      # Step 3: Securely authenticate with Docker Hub using repository secrets
      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      # Step 4: Generate automated metadata tags (:latest and commit SHA)
      - name: Extract Docker metadata tags
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ secrets.DOCKERHUB_USERNAME }}/ecommerce-backend
          tags: |
            type=raw,value=latest
            type=sha,format=short

      # Step 5: Build and push immutable image with GitHub Actions layer caching
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
* **Security & Traceability Note**: Notice how we authenticate using `DOCKERHUB_TOKEN` (a generated Personal Access Token) rather than a raw password, and tag with `${{ steps.meta.outputs.tags }}` which generates both `myuser/ecommerce-backend:latest` and `myuser/ecommerce-backend:sha-a8f9c2d`!

---

## 🛡️ Exercise 2: GHCR Migration Challenge (Zero-Secret Publishing)

Your CTO notices that the engineering team is managing too many third-party secrets across different cloud providers. Since your repository is already hosted on GitHub, she asks you to migrate your Docker container publishing from Docker Hub over to **GitHub Container Registry (GHCR — `ghcr.io`)**.

### Your Task:
Explain why pushing to GitHub Container Registry does **not** require creating manual third-party Personal Access Tokens or repository secrets in GitHub Settings. What built-in GitHub Actions environment token makes this possible, and what explicit permissions must be added to the workflow YAML job to authorize pushing container packages?

---

### ✅ Solution to Exercise 2

1. **Why GHCR requires zero manual secret creation**:
   GitHub Actions natively injects an ephemeral, highly secure authentication token into every executing workflow run, accessible via `${{ secrets.GITHUB_TOKEN }}`. Because GitHub Container Registry (`ghcr.io`) is part of the same unified GitHub ecosystem, your workflow can authenticate directly against GHCR using this built-in token without an administrator needing to generate or maintain external API keys!

2. **Required Workflow Permissions**:
   By default, the automatic `GITHUB_TOKEN` runs with restricted read-only access. To authorize the token to publish new container images into your organization or user account, you must explicitly grant `packages: write` permissions inside your workflow job:

```yaml
jobs:
  ghcr-publish:
    runs-on: ubuntu-latest
    # MANDATORY: Grant write permissions to the automatic token for container packages!
    permissions:
      contents: read
      packages: write

    steps:
      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}          # Automatically resolves to the user/bot pushing code
          password: ${{ secrets.GITHUB_TOKEN }}  # Built-in zero-config authentication!
```

---

## ☸️ Exercise 3: Kubernetes Manifest Challenge

You are designing the Kubernetes production deployment for a high-traffic microservice. The container image is stored in GHCR as `ghcr.io/software-dev/user-service:v2.4`. The Node.js application inside the container listens on port `3000` and requires an environment variable `NODE_ENV` set to `production`.

### Your Task:
Write a combined Kubernetes YAML file (`k8s-user-service.yaml`) declaring two interconnected resources separated by `---\`:
1. **A Deployment**:
   * Named `user-service-deployment` with label `app: user-service`.
   * Manages exactly **4 replica Pods** for high availability.
   * Pulls `ghcr.io/software-dev/user-service:v2.4`.
   * Configures a **Liveness Probe** that performs an HTTP GET request to `/api/health` on port `3000` every 15 seconds to automatically reboot hung containers.
2. **A LoadBalancer Service**:
   * Named `user-service-loadbalancer`.
   * Routes external HTTP traffic arriving on public **port 80** directly into the replica Pods listening on internal **targetPort 3000**.
   * Uses label selectors to match the Deployment's pods.

---

### ✅ Solution to Exercise 3

```yaml
# =========================================================================
# Resource 1: Kubernetes Deployment (Replicas, Rolling Updates, Self-Healing)
# =========================================================================
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service-deployment
  labels:
    app: user-service
spec:
  replicas: 4                    # Maintain 4 identical Pod copies at all times
  selector:
    matchLabels:
      app: user-service          # Selector ties Deployment supervision to Pod labels below
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
        - name: user-api-container
          image: ghcr.io/software-dev/user-service:v2.4
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
          resources:
            limits:
              memory: "512Mi"
              cpu: "500m"
          # Automated Liveness Probe: Reboot Pod if HTTP health endpoint fails
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 15
            failureThreshold: 3

---
# =========================================================================
# Resource 2: Kubernetes Service (Public Load Balancer & DNS Traffic Routing)
# =========================================================================
apiVersion: v1
kind: Service
metadata:
  name: user-service-loadbalancer
spec:
  type: LoadBalancer             # Provisions an external IP from cloud infrastructure
  selector:
    app: user-service            # Routes incoming traffic to ANY Pod with label 'app: user-service'
  ports:
    - protocol: TCP
      port: 80                   # External listening port (e.g., http://api.mydomain.com)
      targetPort: 3000           # Internal container port where Express is listening
```

---

## 🐞 Exercise 4: Kubernetes Debugging & Forensics

During a Friday afternoon deployment, an engineer applies a new YAML manifest using `kubectl apply -f deployment.yaml`. Five minutes later, users report that the application is down. When you check the cluster status, you see the following terminal output:

```bash
$ kubectl get pods
NAME                                       READY   STATUS             RESTARTS   AGE
orders-api-deployment-6b8f9c7d4a-2f4b8     0/1     CrashLoopBackOff   5          4m12s
orders-api-deployment-6b8f9c7d4a-9c1e2     0/1     CrashLoopBackOff   5          4m12s
orders-api-deployment-6b8f9c7d4a-5a8d3     0/1     ImagePullBackOff   0          4m12s
```

### Your Task:
1. Explain what the status **`CrashLoopBackOff`** indicates. What two diagnostic `kubectl` commands would you run against pod `orders-api-deployment-6b8f9c7d4a-2f4b8` to discover why the Node.js process is terminating?
2. Explain what the status **`ImagePullBackOff`** indicates on pod `5a8d3`. What is the most likely root cause, and which specific section of `kubectl describe pod` will give you the exact error message?

---

### ✅ Solution to Exercise 4

1. **Forensic Analysis of `CrashLoopBackOff`**:
   * **What it means**: Kubernetes successfully downloaded the image and started the container, but the primary process inside (e.g., `node server.js`) immediately crashed or exited with an error code (`exit code != 0`). Kubernetes detected the crash and attempted to restart the pod, entering an exponential backoff loop (`CrashLoopBackOff`) after 5 failed restarts.
   * **Diagnostic Commands**:
     * Step 1 — Check application console logs: `kubectl logs orders-api-deployment-6b8f9c7d4a-2f4b8` (or add `--previous` to inspect the log stack trace from the previous crashed instance!). This will reveal Node.js runtime errors like `Error: Cannot connect to DATABASE_URL` or `SyntaxError: Unexpected token`.
     * Step 2 — Inspect pod exit codes and termination reasons: `kubectl describe pod orders-api-deployment-6b8f9c7d4a-2f4b8`. Look under the `Containers -> State -> Terminated` section to see the exact exit code (e.g., `Exit Code: 137` indicates `OOMKilled` out-of-memory termination!).

2. **Forensic Analysis of `ImagePullBackOff`**:
   * **What it means**: The Kubernetes Kubelet agent on the worker node is unable to download the Docker image specified in the container manifest.
   * **Most likely root causes**: 1) A typographical error in the image repository or tag name (e.g., `ghcr.io/myuser/my-api:v2.999` does not exist), or 2) The image resides in a private registry and the manifest lacks an `imagePullSecrets` configuration authorizing the cluster to pull it.
   * **Exact Diagnostic Command**: Run `kubectl describe pod orders-api-deployment-6b8f9c7d4a-5a8d3` and scroll down to the bottom **Events** section! You will see explicit warning logs such as:
     * `Failed to pull image "orders-api:v2": rpc error: code = NotFound desc = failed to pull and unpack image: repository does not exist` OR
     * `pull access denied, repository does not exist or may require authorization: server message: insufficient_scope`.

---

## ⚙️ Exercise 5: Declarative vs. Imperative Deployment Analysis

In Kubernetes, you can create a deployment using an **Imperative CLI Command**:
```bash
kubectl create deployment web-api --image=ghcr.io/myuser/api:v1 --replicas=3
```
OR by authoring a **Declarative YAML Manifest** (`deployment.yaml`) and applying it:
```bash
kubectl apply -f deployment.yaml
```

### Your Task:
Write a short analysis explaining why enterprise DevOps teams strictly enforce **Declarative YAML Manifests** over imperative CLI commands in production environments. Connect your answer to the concepts of **GitOps**, code review audits, and disaster recovery.

---

### ✅ Solution to Exercise 5

While imperative CLI commands like `kubectl create deployment` are convenient for quick debugging on a local laptop, they are strictly prohibited in production enterprise DevOps environments for three critical reasons:
1. **GitOps & Auditability**: Declarative YAML manifests are committed directly into version control systems like Git alongside the application code. This provides a permanent, auditable history of every architectural change. If an infrastructure change causes an outage, teams can inspect Git commit diffs to see who changed `replicas: 3` to `replicas: 30`, and why! Imperative terminal commands leave no permanent record or code review paper trail.
2. **Disaster Recovery & Automation**: If a physical data center catches fire and a Kubernetes cluster is destroyed, restoring from imperative commands would require an engineer to manually remember and re-type hundreds of complex terminal commands in exact sequence. With declarative manifests, an automated CI/CD disaster recovery script simply runs `kubectl apply -f ./k8s-manifests/` against a fresh cluster, restoring the entire 100-microservice architecture to its exact desired state in seconds!
3. **The Declarative Control Loop**: Declarative YAML does not tell Kubernetes *how* to perform actions step-by-step; it simply defines the authoritative **Desired State**. The Kubernetes Controller Manager continuously monitors the cluster and independently calculates the exact delta required to make the physical reality match the YAML declaration, enabling automated self-healing without human intervention.
