# Lesson 44 Example: Standalone CI/CD & Kubernetes Simulator

This standalone Node.js simulation engine reproduces the execution of GitHub Actions Docker builds, container registry publishing, and Kubernetes cluster self-healing loops without requiring Docker Desktop, Minikube, or live cloud credentials!

## ✨ What It Simulates
* **GitHub Actions Layer Caching**: Simulates `docker/setup-buildx-action` and `cache-from: type=gha`, showing sub-second build times when dependencies hit cache.
* **Registry Authentication & Multi-Tagging**: Simulates publishing images to `ghcr.io` or Docker Hub tagged with both `:latest` and Git Commit SHAs (`${{ github.sha }}`).
* **Kubernetes Controller Manager Self-Healing Loop**: Maintains an active registry of simulated Worker Node Pods. If you trigger a crash test (`POST /api/k8s/kill-pod`), the background reconciliation loop detects the dead replica and automatically boots a fresh replacement Pod in **200 milliseconds**!
* **LoadBalancer Traffic Routing**: Distributes incoming HTTP requests evenly across all healthy Running pods in the cluster.

## 🚀 Local Running & Testing
```bash
# Install dependencies strictly using pnpm
pnpm install

# Start local simulator engine
pnpm dev
```
Simulator running on `http://localhost:3008`!
You can interact with it directly via our **4-Tab Glassmorphism Lab** in `examples/cicd-k8s-lab/index.html`!
