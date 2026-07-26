# Lesson 44 — Cloud & Advanced Topics: Advanced CI/CD (Docker in CI/CD, Kubernetes Intro)
**Software-Dev-2026 Curriculum**

Welcome to **Lesson 44**! In this module, you will bridge the gap between containerized application development and industrial-grade cloud orchestration. You will learn how to transform your Docker images into immutable CI/CD deployment artifacts using **GitHub Actions**, publish them to container registries (**Docker Hub** and **GitHub Container Registry - GHCR**), and master the architectural foundations of **Kubernetes (K8s)**—the world's leading container orchestration system.

---

## 🎯 Learning Objectives

By the end of this session, you will be able to:
1. **Integrate Docker into CI/CD Pipelines**: Configure GitHub Actions workflows (`.github/workflows/docker-publish.yml`) to automatically build multi-arch Docker images and push them to remote container registries upon git push.
2. **Master Registry Authentication**: Securely configure GitHub Secrets (`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`) and leverage automatic GitHub Container Registry tokens (`${{ secrets.GITHUB_TOKEN }}`) for zero-configuration image publishing.
3. **Understand Kubernetes Architecture**: Differentiate between the Kubernetes Control Plane (API Server, Scheduler, Controller Manager) and Worker Nodes (Kubelet, Container Runtime, Kube-proxy).
4. **Author Declarative K8s Manifests**: Write production YAML configurations for **Deployments** (managing replicas, rolling updates, and self-healing pods), **Services** (ClusterIP and LoadBalancer networking), and **ConfigMaps/Secrets**.
5. **Simulate Orchestration & Self-Healing**: Trace live container deployments, scale replica counts dynamically, and witness K8s automated pod replacement and crash recovery using our interactive 4-tab glassmorphism cluster lab!

---

## 📂 Folder Structure

```
Lesson 44/
├── README.md                              # This module overview
├── notes/
│   ├── tutor_notes.md                     # Teaching guide, orchestra conductor analogies, K8s debugging & gotchas
│   └── student_notes.md                   # Comprehensive reference on Docker CI/CD, GHCR, K8s manifests & architecture
├── exercises/
│   └── advanced_cicd_practice.md          # 5 exercises on GitHub Actions Docker workflows, K8s YAML, and CrashLoop forensics
└── examples/
    ├── github-actions-docker/             # Sample Express microservice with complete Docker Hub & GHCR workflow templates
    ├── k8s-manifests-demo/                # Production Kubernetes YAML suite (ConfigMaps, Secrets, Deployments, Services, Ingress)
    ├── cicd-k8s-simulator/                # Standalone Node.js CI/CD pipeline & Kubernetes cluster runtime simulator
    └── cicd-k8s-lab/
        └── index.html                     # 4-tab interactive dark glassmorphism lab (Pipeline runner, K8s cluster orchestrator)
```

---

## 🚀 Quickstart Guide

All demonstration projects in Lesson 44 are equipped with **Dual-Mode Simulators**, allowing you to test CI/CD Docker image builds, container registry pushes, and Kubernetes self-healing cluster orchestration **instantly offline** out of the box!

### 1. Test the CI/CD Containerized Express Microservice
An API designed for Kubernetes deployment that injects build timestamps, git commit SHAs, and reports internal pod metadata:
```bash
cd examples/github-actions-docker
pnpm install
pnpm dev
```
* Microservice running at: `http://localhost:3007`
* Inspect pod telemetry & build SHA: `http://localhost:3007/api/telemetry`
* View reusable workflow templates in `.github-workflows-sample/`!

### 2. Launch the Standalone CI/CD & Kubernetes Cluster Simulator
Simulates a GitHub Actions build pipeline, container registry storage, and a multi-node Kubernetes cluster with automated rolling updates and self-healing:
```bash
cd ../cicd-k8s-simulator
pnpm install
pnpm dev
```
* Simulator REST API & Cluster Engine running at: `http://localhost:3008`
* Inspect cluster pods & replica status: `http://localhost:3008/api/k8s/cluster`
* Trigger a simulated rolling deployment: `POST http://localhost:3008/api/pipeline/trigger`

### 3. Launch the Interactive Advanced CI/CD & K8s Lab
Open `examples/cicd-k8s-lab/index.html` directly in any web browser to explore the **CI/CD Pipeline Animated Visualizer**, test live **Kubernetes YAML manifest validation**, dynamically scale pods in the **Cluster Orchestrator Workbench**, and take the **Mastery Quiz**!
