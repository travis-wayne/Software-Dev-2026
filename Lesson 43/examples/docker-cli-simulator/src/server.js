import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

// In-memory Docker Engine Registry & Container State
const state = {
  images: [
    { id: 'img_8a1f4b2c', repository: 'node', tag: '18-alpine', size: '172MB', created: '2 weeks ago', isBase: true },
    { id: 'img_3c9d7e1a', repository: 'postgres', tag: '15-alpine', size: '210MB', created: '3 weeks ago', isBase: true },
    { id: 'img_5b2e8d9f', repository: 'redis', tag: '7-alpine', size: '32MB', created: '1 month ago', isBase: true },
    { id: 'img_1a2b3c4d', repository: 'node-docker-demo', tag: 'latest', size: '185MB', created: 'Just now', isBase: false }
  ],
  containers: [
    {
      id: '6f8a9e4d1c2b',
      names: 'api-server-demo',
      image: 'node-docker-demo:latest',
      command: 'node src/server.js',
      created: '5 minutes ago',
      status: 'Up 5 minutes',
      state: 'RUNNING',
      ports: '0.0.0.0:8080->3000/tcp',
      env: ['PORT=3000', 'NODE_ENV=development'],
      logs: [
        '[System] Container initialized with 1024MB memory limit.',
        '[Express] Server listening on container port 3000.',
        '[DevOps] Liveness probe monitoring active on /api/health.'
      ]
    }
  ],
  buildHistory: []
};

/**
 * Utility to generate random 12-character hex container/image ID
 */
function generateId() {
  return crypto.randomBytes(6).toString('hex');
}

/**
 * GET /api/images
 * List all available Docker images in local registry
 */
app.get('/api/images', (req, res) => {
  res.json({ status: 'success', images: state.images });
});

/**
 * GET /api/containers
 * List all running and stopped containers
 */
app.get('/api/containers', (req, res) => {
  res.json({ status: 'success', containers: state.containers });
});

/**
 * POST /api/exec
 * Executes simulated Docker CLI commands with realistic terminal output
 */
app.post('/api/exec', (req, res) => {
  const { command } = req.body;
  if (!command || typeof command !== 'string') {
    return res.status(400).json({ error: 'Please provide a valid command string (e.g., "docker ps").' });
  }

  const trimmed = command.trim();
  const parts = trimmed.split(/\s+/);

  if (parts[0] !== 'docker') {
    return res.json({
      success: false,
      output: `bash: ${parts[0]}: command not found. Try starting with 'docker' (e.g., 'docker ps' or 'docker run ...').`
    });
  }

  const subcmd = parts[1];

  // 1. DOCKER PS
  if (subcmd === 'ps') {
    const showAll = parts.includes('-a') || parts.includes('--all');
    const filtered = showAll ? state.containers : state.containers.filter(c => c.state === 'RUNNING');
    
    let output = `CONTAINER ID   IMAGE                     COMMAND                CREATED         STATUS          PORTS                    NAMES\n`;
    if (filtered.length === 0) {
      output += `(No running containers found. Use 'docker run -d -p 8080:3000 node-docker-demo:latest' to start one!)`;
    } else {
      filtered.forEach(c => {
        output += `${c.id}   ${c.image.padEnd(25)} "${c.command.padEnd(20)}"   ${c.created.padEnd(15)} ${c.status.padEnd(15)} ${c.ports.padEnd(24)} ${c.names}\n`;
      });
    }
    return res.json({ success: true, command: trimmed, output });
  }

  // 2. DOCKER IMAGES
  if (subcmd === 'images' || (subcmd === 'image' && parts[2] === 'ls')) {
    let output = `REPOSITORY          TAG         IMAGE ID       CREATED         SIZE\n`;
    state.images.forEach(img => {
      output += `${img.repository.padEnd(20)} ${img.tag.padEnd(11)} ${img.id.padEnd(14)} ${img.created.padEnd(15)} ${img.size}\n`;
    });
    return res.json({ success: true, command: trimmed, output });
  }

  // 3. DOCKER RUN
  if (subcmd === 'run') {
    const isDetached = parts.includes('-d') || parts.includes('--detach');
    
    // Parse port mapping -p H:C
    let portMapping = '0.0.0.0:8080->3000/tcp';
    const pIndex = parts.indexOf('-p');
    if (pIndex !== -1 && parts[pIndex + 1]) {
      const pVal = parts[pIndex + 1];
      const pSplit = pVal.split(':');
      if (pSplit.length === 2) {
        // Check port collision
        const collision = state.containers.find(c => c.state === 'RUNNING' && c.ports.includes(`:${pSplit[0]}->`));
        if (collision) {
          return res.json({
            success: false,
            output: `docker: Error response from daemon: driver failed programming external connectivity on endpoint: Bind for 0.0.0.0:${pSplit[0]} failed: port is already allocated by container ${collision.names} (${collision.id}).`
          });
        }
        portMapping = `0.0.0.0:${pSplit[0]}->${pSplit[1]}/tcp`;
      }
    }

    // Parse container name --name
    let name = `app_${generateId().slice(0, 4)}`;
    const nIndex = parts.indexOf('--name');
    if (nIndex !== -1 && parts[nIndex + 1]) {
      name = parts[nIndex + 1];
      const nameCollision = state.containers.find(c => c.names === name);
      if (nameCollision) {
        return res.json({
          success: false,
          output: `docker: Error response from daemon: Conflict. The container name "/${name}" is already in use by container "${nameCollision.id}". You have to remove (or rename) that container to be able to reuse that name.`
        });
      }
    }

    // Find target image (last non-flag argument)
    const imgArg = parts[parts.length - 1];
    const imageExists = state.images.some(i => `${i.repository}:${i.tag}` === imgArg || i.repository === imgArg || i.id === imgArg);
    
    const newId = generateId();
    const newContainer = {
      id: newId,
      names: name,
      image: imageExists ? imgArg : 'node-docker-demo:latest',
      command: 'node src/server.js',
      created: 'Just now',
      status: 'Up 1 second',
      state: 'RUNNING',
      ports: portMapping,
      env: ['PORT=3000', 'NODE_ENV=production', 'SIMULATED=true'],
      logs: [
        `[Docker Engine] Booting micro-container ${newId} (${name})...`,
        `[Network] Mapping interface ${portMapping}...`,
        `[Express] Server successfully initialized and listening.`
      ]
    };

    state.containers.unshift(newContainer);

    let output = isDetached
      ? `${newId}2a4b8c9d0e1f2a3b4c5d6e7f8a9b0c1d` // Full 64-char sha
      : `[Express] Server listening on container port 3000\n[DevOps] Telemetry active. (Container ${newId} running in foreground)`;

    return res.json({ success: true, command: trimmed, output, container: newContainer });
  }

  // 4. DOCKER STOP
  if (subcmd === 'stop') {
    const target = parts[2];
    if (!target) {
      return res.json({ success: false, output: `\"docker stop\" requires at least 1 argument.\nSee 'docker stop --help'.` });
    }
    const container = state.containers.find(c => c.id === target || c.names === target || c.id.startsWith(target));
    if (!container) {
      return res.json({ success: false, output: `Error response from daemon: No such container: ${target}` });
    }
    container.state = 'STOPPED';
    container.status = 'Exited (0) Just now';
    container.ports = '';
    return res.json({ success: true, command: trimmed, output: `${container.names}` });
  }

  // 5. DOCKER RM
  if (subcmd === 'rm') {
    const target = parts[2];
    if (!target) {
      return res.json({ success: false, output: `\"docker rm\" requires at least 1 argument.\nSee 'docker rm --help'.` });
    }
    const idx = state.containers.findIndex(c => c.id === target || c.names === target || c.id.startsWith(target));
    if (idx === -1) {
      return res.json({ success: false, output: `Error response from daemon: No such container: ${target}` });
    }
    if (state.containers[idx].state === 'RUNNING' && !parts.includes('-f') && !parts.includes('--force')) {
      return res.json({ success: false, output: `Error response from daemon: You cannot remove a running container ${state.containers[idx].id}. Stop the container before attempting removal or force remove using -f.` });
    }
    const removedName = state.containers[idx].names;
    state.containers.splice(idx, 1);
    return res.json({ success: true, command: trimmed, output: `${removedName}` });
  }

  // 6. DOCKER LOGS
  if (subcmd === 'logs') {
    const target = parts[parts.length - 1];
    const container = state.containers.find(c => c.id === target || c.names === target || c.id.startsWith(target));
    if (!container) {
      return res.json({ success: false, output: `Error response from daemon: No such container: ${target}` });
    }
    return res.json({ success: true, command: trimmed, output: container.logs.join('\n') });
  }

  // 7. DOCKER BUILD
  if (subcmd === 'build') {
    let tag = 'my-custom-image:latest';
    const tIndex = parts.indexOf('-t');
    if (tIndex !== -1 && parts[tIndex + 1]) {
      tag = parts[tIndex + 1];
    }
    const [repo, tagName = 'latest'] = tag.split(':');
    const newId = `img_${generateId()}`;
    
    state.images.unshift({
      id: newId,
      repository: repo,
      tag: tagName,
      size: '180MB',
      created: 'Just now',
      isBase: false
    });

    const output = `Sending build context to Docker daemon  2.048MB
Step 1/8 : FROM node:18-alpine
 ---> 8a1f4b2c3d4e
Step 2/8 : WORKDIR /usr/src/app
 ---> Using cache
 ---> 9b2c3d4e5f6a
Step 3/8 : RUN corepack enable
 ---> Using cache
 ---> 1c2d3e4f5a6b
Step 4/8 : COPY package.json pnpm-lock.yaml ./
 ---> Using cache
 ---> 7d8e9f0a1b2c
Step 5/8 : RUN pnpm install --frozen-lockfile
 ---> Using cache (Layer Caching Optimization active!)
 ---> 3a4b5c6d7e8f
Step 6/8 : COPY . .
 ---> 5e6f7a8b9c0d
Step 7/8 : EXPOSE 3000
 ---> Running in 2a3b4c5d6e7f
 ---> 8b9c0d1e2f3a
Step 8/8 : USER node
 ---> Running in 4c5d6e7f8a9b
 ---> ${newId}
Successfully built ${newId}
Successfully tagged ${tag}`;

    return res.json({ success: true, command: trimmed, output });
  }

  // Fallback help
  return res.json({
    success: false,
    output: `Simulator note: Command '${trimmed}' is recognized by syntax but not fully implemented in this offline demo. Supported commands: 'docker ps [-a]', 'docker images', 'docker run -d -p H:C --name NAME IMAGE', 'docker stop ID', 'docker rm ID', 'docker logs ID', 'docker build -t NAME .' `
  });
});

/**
 * GET /
 * Welcome dashboard route
 */
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 650px; margin: 40px auto; padding: 30px; background: #0b1120; color: #f8fafc; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);">
      <h1 style="color: #38bdf8; margin-top: 0;">⚡ Lesson 43: Offline Docker CLI Simulator</h1>
      <p style="color: #94a3b8; line-height: 1.6;">Welcome to the offline Docker Engine simulator! This backend simulates Docker daemon behavior, UnionFS layer building, port mapping collision detection, and container lifecycles.</p>
      <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin: 20px 0; font-family: monospace;">
        <strong>API Endpoints:</strong><br/>
        <a href="/api/images" style="color: #34d399; text-decoration: none;">GET /api/images</a> &mdash; List local Docker images<br/>
        <a href="/api/containers" style="color: #34d399; text-decoration: none;">GET /api/containers</a> &mdash; List container states<br/>
        <span style="color: #a78bfa;">POST /api/exec</span> &mdash; Execute simulated Docker CLI commands
      </div>
      <p style="font-size: 14px; color: #64748b;">Software-Dev-2026 Curriculum &bull; Lesson 43 Containerization</p>
    </div>
  `);
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`⚡ Lesson 43 Docker CLI Simulator running on port ${PORT}`);
  console.log(`📡 Images endpoint:     http://localhost:${PORT}/api/images`);
  console.log(`📦 Containers endpoint: http://localhost:${PORT}/api/containers`);
  console.log(`======================================================\n`);
});
