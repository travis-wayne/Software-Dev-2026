# Lesson 44 Example: Production Kubernetes YAML Manifest Suite

This directory contains a complete, production-grade suite of Kubernetes (K8s) YAML declarations for deploying a high-availability, self-healing Express microservice.

## 📂 Manifest Hierarchy
1. `01-configmap-secret.yaml` -> Decouples non-sensitive environment variables (`ConfigMap`) and Base64-encoded credentials (`Secret`) from container images.
2. `02-deployment.yaml` -> Declares our Express API Deployment (`replicas: 3`), zero-downtime rolling update strategy, container CPU/Memory limits, and automated Liveness/Readiness probes.
3. `03-service.yaml` -> Provisions internal cluster networking (`ClusterIP`) and external public cloud routing (`LoadBalancer`).
4. `04-ingress.yaml` -> Configures domain routing (`api.softwaredev2026.com`) and automated TLS/SSL certificate termination via NGINX Ingress Controller.

## 🛠️ Deploying to a Live K8s Cluster (Minikube, Kind, or Cloud EKS/GKE)
```bash
# 1. Apply configuration & secrets first
kubectl apply -f 01-configmap-secret.yaml

# 2. Deploy 3 replica pods with self-healing
kubectl apply -f 02-deployment.yaml

# 3. Expose services and load balancer
kubectl apply -f 03-service.yaml

# 4. (Optional) Configure domain ingress
kubectl apply -f 04-ingress.yaml
```

## 🔍 Verification & Forensics Commands
```bash
# Check pod status (Watch them boot!)
kubectl get pods -l app=express-api -o wide

# Verify Service LoadBalancer IP assignment
kubectl get services

# Simulate a crash test! Delete a pod and watch K8s self-heal in 200ms
kubectl delete pod <pod-name>
kubectl get pods
```
