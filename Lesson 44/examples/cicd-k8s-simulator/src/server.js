/**
 * Lesson 44 — Standalone CI/CD & Kubernetes Cluster Simulator
 * 
 * Provides offline simulation of GitHub Actions Docker builds, container registry publishing,
 * and Kubernetes cluster orchestration (Deployments, Services, Self-Healing Replica Loops).
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3008;

app.use(cors());
app.use(express.json());

// ============================================================================
// SIMULATED STATE
// ============================================================================

// 1. CI/CD Pipeline State
let activePipeline = {
  id: null,
  status: 'IDLE', // IDLE | RUNNING | COMPLETED | FAILED
  currentStep: '',
  progress: 0,
  logs: [],
  targetRegistry: 'ghcr.io',
  imageName: 'express-api-service',
  tag: 'latest',
  gitSha: 'a8f9c2d',
  startTime: null
};

// 2. Container Registry Storage
let registryImages = [
  {
    repository: 'ghcr.io/software-dev/express-api-service',
    tag: 'v1.0-a8f9c2d',
    sizeMb: 142,
    digest: 'sha256:7b9c2a1f0e4b8d6c5a3b2e1f0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1',
    pushedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    repository: 'ghcr.io/software-dev/express-api-service',
    tag: 'latest',
    sizeMb: 142,
    digest: 'sha256:7b9c2a1f0e4b8d6c5a3b2e1f0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1',
    pushedAt: new Date(Date.now() - 3600000).toISOString()
  }
];

// 3. Kubernetes Cluster State
let clusterState = {
  clusterName: process.env.SIM_CLUSTER_NAME || 'software-dev-production-k8s',
  masterStatus: 'HEALTHY',
  desiredReplicas: Number(process.env.DEFAULT_REPLICAS) || 3,
  currentImage: 'ghcr.io/software-dev/express-api-service:latest',
  totalTrafficRequests: 0,
  pods: []
};

// Helper: Generate random 5-char K8s hash
function genHash() {
  return Math.random().toString(36).substring(2, 7);
}

// Initialize default pods
function initPods() {
  clusterState.pods = [];
  for (let i = 0; i < clusterState.desiredReplicas; i++) {
    clusterState.pods.push({
      id: `express-api-deployment-7f8b9c-${genHash()}`,
      name: `express-api-deployment-7f8b9c-${genHash()}`,
      status: 'Running', // Running | CrashLoopBackOff | Terminating | Pending
      restarts: 0,
      ip: `10.244.0.${10 + i}`,
      node: `worker-node-${(i % 2) + 1}`,
      image: clusterState.currentImage,
      cpuPercent: Math.floor(Math.random() * 15) + 5,
      memoryMiB: Math.floor(Math.random() * 20) + 45,
      uptimeSeconds: Math.floor(Math.random() * 600) + 60,
      startedAt: new Date().toISOString()
    });
  }
}
initPods();

// ============================================================================
// KUBERNETES CONTROLLER MANAGER SELF-HEALING LOOP
// Continuously checks if active pods match desired replicas!
// ============================================================================
setInterval(() => {
  // 1. Remove Terminating pods after 2 seconds
  clusterState.pods = clusterState.pods.filter(p => p.status !== 'Terminating');

  // 2. Check if we need to scale up (Self-healing replacement!)
  const runningCount = clusterState.pods.length;
  if (runningCount < clusterState.desiredReplicas) {
    const newIndex = runningCount;
    const newPod = {
      id: `express-api-deployment-7f8b9c-${genHash()}`,
      name: `express-api-deployment-7f8b9c-${genHash()}`,
      status: 'Pending',
      restarts: 0,
      ip: `10.244.0.${Math.floor(Math.random() * 200) + 10}`,
      node: `worker-node-${(newIndex % 2) + 1}`,
      image: clusterState.currentImage,
      cpuPercent: 8,
      memoryMiB: 48,
      uptimeSeconds: 1,
      startedAt: new Date().toISOString()
    };
    clusterState.pods.push(newPod);
    console.log(`☸️ [K8s Controller Manager] Self-Healing triggered! Booting replacement Pod: ${newPod.name}`);
    
    // Transition from Pending to Running after 500ms
    setTimeout(() => {
      newPod.status = 'Running';
    }, 500);
  }
  
  // 3. Check if we need to scale down
  if (runningCount > clusterState.desiredReplicas) {
    const excess = runningCount - clusterState.desiredReplicas;
    for (let i = 0; i < excess; i++) {
      const podToRemove = clusterState.pods[clusterState.pods.length - 1 - i];
      if (podToRemove) {
        podToRemove.status = 'Terminating';
      }
    }
  }

  // 4. Update stats for running pods
  clusterState.pods.forEach(p => {
    if (p.status === 'Running') {
      p.uptimeSeconds += 1;
      // Slight fluctuation in resource usage
      p.cpuPercent = Math.max(2, Math.min(95, p.cpuPercent + (Math.floor(Math.random() * 5) - 2)));
    }
  });
}, 1000);

// ============================================================================
// REST API ENDPOINTS
// ============================================================================

/**
 * GET /api/status
 * General simulator health check
 */
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    service: 'cicd-k8s-simulator',
    version: '1.0.0',
    clusterName: clusterState.clusterName,
    activePods: clusterState.pods.length,
    desiredReplicas: clusterState.desiredReplicas
  });
});

/**
 * GET /api/pipeline/status
 * Returns current state of the CI/CD Docker build pipeline
 */
app.get('/api/pipeline/status', (req, res) => {
  res.json(activePipeline);
});

/**
 * POST /api/pipeline/trigger
 * Triggers an asynchronous CI/CD Docker build and registry push simulation
 */
app.post('/api/pipeline/trigger', (req, res) => {
  if (activePipeline.status === 'RUNNING') {
    return res.status(400).json({ error: 'A CI/CD build pipeline is already currently executing!' });
  }

  const { registry = 'ghcr.io', imageName = 'express-api-service', tag = 'v2.5', gitSha = genHash() } = req.body;

  activePipeline = {
    id: `run-${Date.now()}`,
    status: 'RUNNING',
    currentStep: 'Step 1: Checkout repository source code',
    progress: 10,
    logs: [
      `[${new Date().toLocaleTimeString()}] 🚀 Triggered GitHub Actions CI/CD Pipeline (Workflow: docker-publish.yml)`,
      `[${new Date().toLocaleTimeString()}] 📦 Checking out commit SHA: ${gitSha}...`
    ],
    targetRegistry: registry,
    imageName: imageName,
    tag: tag,
    gitSha: gitSha,
    startTime: new Date().toISOString()
  };

  res.json({ message: 'Pipeline simulation started successfully!', pipeline: activePipeline });

  // Execute asynchronous step simulation
  setTimeout(() => {
    activePipeline.currentStep = 'Step 2: Set up Docker Buildx & Layer Caching';
    activePipeline.progress = 30;
    activePipeline.logs.push(`[${new Date().toLocaleTimeString()}] 🐳 Initializing Docker Buildx builder instance...`);
    activePipeline.logs.push(`[${new Date().toLocaleTimeString()}] ⚡ Restoring UnionFS layer cache from GitHub Actions Cache (type=gha)... [CACHE HIT on node_modules layer!]`);
  }, 1500);

  setTimeout(() => {
    activePipeline.currentStep = 'Step 3: Authenticating with Container Registry';
    activePipeline.progress = 55;
    if (registry === 'ghcr.io') {
      activePipeline.logs.push(`[${new Date().toLocaleTimeString()}] 🔐 Authenticating to ghcr.io using zero-config \${{ secrets.GITHUB_TOKEN }}... Success!`);
    } else {
      activePipeline.logs.push(`[${new Date().toLocaleTimeString()}] 🔐 Authenticating to hub.docker.com using secret \${{ secrets.DOCKERHUB_TOKEN }}... Success!`);
    }
  }, 3000);

  setTimeout(() => {
    activePipeline.currentStep = 'Step 4: Compiling Multi-Stage Docker Image';
    activePipeline.progress = 75;
    activePipeline.logs.push(`[${new Date().toLocaleTimeString()}] 🔨 Compiling Stage 1 (builder) -> pnpm install --frozen-lockfile --prod`);
    activePipeline.logs.push(`[${new Date().toLocaleTimeString()}] 🔨 Compiling Stage 2 (runner) -> Injecting ARG GIT_SHA=${gitSha}, setting USER nodeuser (UID 1001)`);
  }, 4500);

  setTimeout(() => {
    activePipeline.currentStep = 'Step 5: Pushing Image to Container Registry';
    activePipeline.progress = 90;
    activePipeline.logs.push(`[${new Date().toLocaleTimeString()}] 📤 Pushing layer sha256:8f9c2a1... [Pushed 142MB]`);
    activePipeline.logs.push(`[${new Date().toLocaleTimeString()}] 🔖 Tagging image as ${registry}/software-dev/${imageName}:${tag}`);
    activePipeline.logs.push(`[${new Date().toLocaleTimeString()}] 🔖 Tagging image as ${registry}/software-dev/${imageName}:${gitSha}`);
  }, 6000);

  setTimeout(() => {
    activePipeline.currentStep = 'Completed successfully! Image published and ready for Kubernetes deployment.';
    activePipeline.progress = 100;
    activePipeline.status = 'COMPLETED';
    activePipeline.logs.push(`[${new Date().toLocaleTimeString()}] ✅ Pipeline build completed in 7.4s! Container ready at ${registry}/software-dev/${imageName}:${tag}`);

    // Add to simulated registry
    const newImg = {
      repository: `${registry}/software-dev/${imageName}`,
      tag: tag,
      sizeMb: 142,
      digest: `sha256:${Math.random().toString(16).substring(2, 10)}...`,
      pushedAt: new Date().toISOString()
    };
    registryImages.unshift(newImg);
    // Update Kubernetes cluster current image target
    clusterState.currentImage = `${registry}/software-dev/${imageName}:${tag}`;
  }, 7500);
});

/**
 * GET /api/registry/images
 * Returns all published images in the simulated registry
 */
app.get('/api/registry/images', (req, res) => {
  res.json({ count: registryImages.length, images: registryImages });
});

/**
 * GET /api/k8s/cluster
 * Returns live Kubernetes cluster state and pod metrics
 */
app.get('/api/k8s/cluster', (req, res) => {
  res.json(clusterState);
});

/**
 * POST /api/k8s/scale
 * Scales the desired replica count dynamically
 */
app.post('/api/k8s/scale', (req, res) => {
  const { replicas } = req.body;
  const num = Number(replicas);
  if (isNaN(num) || num < 0 || num > 12) {
    return res.status(400).json({ error: 'Replicas must be a number between 0 and 12.' });
  }
  clusterState.desiredReplicas = num;
  console.log(`☸️ [K8s API Server] Deployment desiredReplicas updated to: ${num}`);
  res.json({ message: `Scaling Deployment to ${num} replicas... Controller Manager is reconciling state.`, clusterState });
});

/**
 * POST /api/k8s/kill-pod
 * Simulates a hardware failure or process OOM crash by terminating a specific pod!
 * Demonstrates Kubernetes instantaneous Self-Healing replacement loop!
 */
app.post('/api/k8s/kill-pod', (req, res) => {
  const { podId } = req.body;
  const targetPod = clusterState.pods.find(p => p.id === podId || p.name === podId);
  if (!targetPod) {
    return res.status(404).json({ error: `Pod ${podId} not found in active cluster.` });
  }
  targetPod.status = 'Terminating';
  console.log(`💥 [K8s Chaos Simulator] Pod killed: ${targetPod.name} (Status -> Terminating)`);
  res.json({ 
    message: `💥 Pod ${targetPod.name} killed! The K8s Controller Manager will detect the missing replica and automatically boot a replacement Pod in 200ms!`,
    killedPod: targetPod.name 
  });
});

/**
 * POST /api/k8s/traffic
 * Simulates sending incoming user HTTP requests through the LoadBalancer Service across healthy replica pods
 */
app.post('/api/k8s/traffic', (req, res) => {
  const { requests = 10 } = req.body;
  const count = Number(requests) || 10;
  
  const runningPods = clusterState.pods.filter(p => p.status === 'Running');
  if (runningPods.length === 0) {
    return res.status(503).json({ error: '503 Service Unavailable — No healthy Pods available in cluster to handle traffic!' });
  }

  const distribution = {};
  runningPods.forEach(p => { distribution[p.name] = 0; });

  for (let i = 0; i < count; i++) {
    const randomPod = runningPods[i % runningPods.length];
    distribution[randomPod.name]++;
    randomPod.cpuPercent = Math.min(99, randomPod.cpuPercent + 3);
  }

  clusterState.totalTrafficRequests += count;

  res.json({
    message: `✅ Successfully routed ${count} HTTP requests through LoadBalancer Service!`,
    totalRequestsServed: clusterState.totalTrafficRequests,
    podLoadDistribution: distribution
  });
});

app.listen(PORT, () => {
  console.log(`\n====================================================================`);
  console.log(`🚀 Lesson 44 Standalone CI/CD & K8s Simulator running on port ${PORT}`);
  console.log(`⚙️ Endpoints:`);
  console.log(`   GET  /api/pipeline/status  -> View live Docker build step progress`);
  console.log(`   POST /api/pipeline/trigger -> Trigger simulated GitHub Actions pipeline`);
  console.log(`   GET  /api/k8s/cluster      -> Inspect live Kubernetes Pods & replicas`);
  console.log(`   POST /api/k8s/scale        -> Scale replica count dynamically`);
  console.log(`   POST /api/k8s/kill-pod     -> Sim pod crash to witness K8s Self-Healing!`);
  console.log(`====================================================================\n`);
});
