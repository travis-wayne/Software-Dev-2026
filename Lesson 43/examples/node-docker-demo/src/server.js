import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import os from 'os';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

/**
 * Utility function to detect if the Node.js application is running inside a Docker container
 * Checks Linux /proc filesystem, .dockerenv file, or explicit DOCKER_CONTAINER environment variable.
 */
function isRunningInDocker() {
  if (process.env.DOCKER_CONTAINER === 'true' || process.env.DOCKER_CONTAINER === '1') {
    return true;
  }
  try {
    if (fs.existsSync('/.dockerenv')) {
      return true;
    }
    if (fs.existsSync('/proc/self/cgroup')) {
      const cgroup = fs.readFileSync('/proc/self/cgroup', 'utf8');
      if (cgroup.includes('docker') || cgroup.includes('kubepods')) {
        return true;
      }
    }
  } catch (err) {
    // Ignore filesystem read errors on non-Linux hosts (macOS/Windows)
  }
  return false;
}

/**
 * GET /api/info
 * Returns real-time system telemetry and container runtime diagnostics
 */
app.get('/api/info', (req, res) => {
  const containerized = isRunningInDocker();
  
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    service: process.env.APP_NAME || 'Docker Containerized Express Demo',
    environment: process.env.NODE_ENV || 'development',
    containerRuntime: {
      isContainerized: containerized,
      runtimeType: containerized ? 'Docker Engine / Linux Container' : 'Native Host OS (Uncontainerized)',
      hostname: os.hostname(), // In Docker, this is automatically set to the short Container ID (e.g., '6f8a9e4d1c2b')
      platform: `${os.platform()} (${os.release()})`,
      architecture: os.arch(),
      cpuCores: os.cpus().length,
      processId: process.pid,
      nodeVersion: process.version,
      user: os.userInfo().username
    },
    memory: {
      totalMB: Math.round(os.totalmem() / (1024 * 1024)),
      freeMB: Math.round(os.freemem() / (1024 * 1024)),
      processUsageMB: Math.round(process.memoryUsage().rss / (1024 * 1024))
    },
    uptimeSeconds: Math.round(process.uptime()),
    message: containerized
      ? '🐳 Success! This API is running safely inside an isolated Docker container filesystem.'
      : '💻 Notice: This API is currently running directly on your host machine. Run `docker compose up` or check the Docker lab to test container isolation!'
  });
});

/**
 * GET /api/health
 * Standard DevOps health check endpoint for Docker HEALTHCHECK or Kubernetes liveness probes
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /
 * Welcome dashboard route
 */
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 650px; margin: 40px auto; padding: 30px; background: #0b1120; color: #f8fafc; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);">
      <h1 style="color: #38bdf8; margin-top: 0;">🐳 Lesson 43: Docker Container Demo</h1>
      <p style="color: #94a3b8; line-height: 1.6;">Welcome to the containerized Express API demonstration project! This service dynamically inspects its OS cgroups and network environment to detect container isolation.</p>
      <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin: 20px 0; font-family: monospace;">
        <strong>API Endpoints:</strong><br/>
        <a href="/api/info" style="color: #34d399; text-decoration: none;">GET /api/info</a> &mdash; Inspect OS telemetry & container detection<br/>
        <a href="/api/health" style="color: #34d399; text-decoration: none;">GET /api/health</a> &mdash; DevOps liveness probe
      </div>
      <p style="font-size: 14px; color: #64748b;">Software-Dev-2026 Curriculum &bull; Lesson 43 Containerization</p>
    </div>
  `);
});

/**
 * GET /api/db-health
 * Tests the database connection and reports which DB mode is active
 * Demonstrates injecting DATABASE_URL at container runtime!
 */
app.get('/api/db-health', async (req, res) => {
  const dbUrl = process.env.DATABASE_URL;
  const isDocker = isRunningInDocker();
  
  if (!dbUrl) {
    return res.json({
      status: 'no-database',
      message: 'No DATABASE_URL set. Start with: docker run -e DATABASE_URL=postgresql://... my-api',
      tip: 'For local dev, use docker-compose which auto-sets DATABASE_URL via service networking',
      isDocker: isDocker,
      timestamp: new Date().toISOString()
    });
  }

  // Detect which DB provider is being used
  const dbProvider = dbUrl.includes('neon.tech') ? 'Neon PostgreSQL'
    : dbUrl.includes('supabase') ? 'Supabase PostgreSQL'
    : dbUrl.includes('railway') ? 'Railway PostgreSQL'
    : dbUrl.includes('localhost') || dbUrl.includes('postgres-db') ? 'Docker PostgreSQL Container'
    : 'External PostgreSQL';

  try {
    // Attempt a lightweight connection test
    const { Pool } = await import('pg').catch(() => null);
    if (!Pool) {
      return res.json({ status: 'pg-not-installed', dbProvider, message: 'pg package not installed. Run: pnpm add pg' });
    }
    const pool = new Pool({ connectionString: dbUrl, ssl: dbUrl.includes('localhost') ? false : { rejectUnauthorized: false } });
    const result = await pool.query('SELECT NOW() as server_time, version() as pg_version');
    await pool.end();
    return res.json({
      status: 'connected',
      dbProvider,
      serverTime: result.rows[0].server_time,
      pgVersion: result.rows[0].pg_version.split(' ').slice(0, 2).join(' '),
      isDocker,
      message: `Successfully connected to ${dbProvider}!`
    });
  } catch (err) {
    return res.status(503).json({
      status: 'connection-failed',
      dbProvider,
      error: err.message,
      tip: 'Check DATABASE_URL format and network connectivity'
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🐳 Lesson 43 Docker Demo API Server running on port ${PORT}`);
  console.log(`📡 Telemetry endpoint: http://localhost:${PORT}/api/info`);
  console.log(`🏥 Health check:       http://localhost:${PORT}/api/health`);
  console.log(`🛢️  DB Health check:    http://localhost:${PORT}/api/db-health`);
  console.log(`⚡ Containerized:      ${isRunningInDocker() ? 'YES (Docker Container)' : 'NO (Native Host Machine)'}`);
  console.log(`======================================================\n`);
});
