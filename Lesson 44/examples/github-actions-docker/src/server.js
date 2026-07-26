/**
 * Lesson 44 — Advanced CI/CD & Kubernetes Microservice Demo
 * 
 * An Express API designed explicitly to demonstrate containerized builds in GitHub Actions
 * and pod telemetry inside Kubernetes clusters.
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import os from 'os';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());

// Detect if we are running inside a Docker Container or Kubernetes Pod
const isDocker = fs.existsSync('/.dockerenv') || fs.existsSync('/run/.containerenv');
const isK8s = Boolean(process.env.KUBERNETES_SERVICE_HOST || process.env.POD_NAME);

// Telemetry state
const startTime = new Date().toISOString();
let requestCount = 0;

/**
 * GET /api/telemetry
 * Returns deep container and build metadata for CI/CD audit verification
 */
app.get('/api/telemetry', (req, res) => {
  requestCount++;
  res.json({
    status: 'online',
    service: process.env.SERVICE_NAME || 'github-actions-docker-demo',
    version: process.env.APP_VERSION || '2.4.0',
    buildMetadata: {
      gitSha: process.env.GIT_SHA || 'local-dev-untracked',
      buildDate: process.env.BUILD_DATE || new Date().toISOString(),
      registryTag: process.env.REGISTRY_TAG || 'latest'
    },
    orchestration: {
      isDockerContainer: isDocker,
      isKubernetesPod: isK8s,
      podName: process.env.POD_NAME || os.hostname(),
      nodeName: process.env.NODE_NAME || 'local-host-node',
      namespace: process.env.POD_NAMESPACE || 'default'
    },
    runtime: {
      nodeVersion: process.version,
      platform: os.platform(),
      architecture: os.arch(),
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
      totalRequestsServed: requestCount
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/health
 * Automated Liveness Probe endpoint for Kubernetes Deployment self-healing!
 * Kubelet calls this every 15s; if it returns 500, Kubelet kills and restarts the Pod!
 */
app.get('/api/health', (req, res) => {
  // Simulate health check (in real production, check database connection pool)
  const isHealthy = true;
  if (isHealthy) {
    res.status(200).json({ status: 'HEALTHY', timestamp: new Date().toISOString() });
  } else {
    res.status(500).json({ status: 'UNHEALTHY', error: 'Database pool exhausted' });
  }
});

/**
 * GET /
 * Root welcoming endpoint
 */
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Lesson 44 Advanced CI/CD & Kubernetes Microservice is Running!',
    endpoints: [
      'GET /api/telemetry  -> Inspect Docker CI/CD SHA build tags & Kubernetes Pod metadata',
      'GET /api/health     -> Kubernetes Kubelet Liveness/Readiness probe endpoint'
    ],
    podName: os.hostname()
  });
});

app.listen(PORT, () => {
  console.log(`\n====================================================================`);
  console.log(`🚀 Lesson 44 CI/CD Microservice running on http://localhost:${PORT}`);
  console.log(`🐳 Containerized Runtime : ${isDocker ? 'YES (Docker UnionFS)' : 'NO (Native Host)'}`);
  console.log(`☸️ Kubernetes Orchestration: ${isK8s ? 'YES (Active Pod)' : 'NO (Standalone)'}`);
  console.log(`🔖 Git Commit SHA        : ${process.env.GIT_SHA || 'untracked-local'}`);
  console.log(`====================================================================\n`);
});
