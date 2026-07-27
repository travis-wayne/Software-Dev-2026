import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3047;
const JWT_SECRET = process.env.JWT_SECRET || 'lesson47_super_secret_capstone_key_2026';

let pool = null;

// --- Database Connection Setup ---
async function connectDB() {
  if (!process.env.DATABASE_URL) {
    console.log('  \uD83D\uDCBE No DATABASE_URL found \u2014 using in-memory mock DB');
    console.log('  \uD83D\uDCA1 Set DATABASE_URL in .env to connect to Neon PostgreSQL');
    return false;
  }
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }  // Required for Neon
    });
    // Test connection
    await pool.query('SELECT NOW()');
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'TODO',
        priority VARCHAR(50) DEFAULT 'MEDIUM',
        assignee VARCHAR(255),
        workspace_id VARCHAR(100) DEFAULT 'default',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS webhook_events (
        id SERIAL PRIMARY KEY,
        idempotency_key VARCHAR(255) UNIQUE,
        processed_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('  \uD83D\uDC18 Neon PostgreSQL connected & tables ready!');
    return true;
  } catch (err) {
    console.error('  \u26A0\uFE0F  PostgreSQL connection failed:', err.message);
    console.log('  \uD83D\uDCBE Falling back to in-memory mock DB');
    pool = null;
    return false;
  }
}

connectDB();

// --- In-Memory Database Simulation (Fallback) ---
const db = {
  users: [
    { id: 'usr_1', email: 'owner@prostack.app', role: 'OWNER', password: 'password123' },
    { id: 'usr_2', email: 'admin@prostack.app', role: 'ADMIN', password: 'password123' },
    { id: 'usr_3', email: 'dev@prostack.app', role: 'MEMBER', password: 'password123' },
  ],
  workspaces: [
    { id: 'ws_1', name: 'Software-Dev-2026 Cohort', ownerId: 'usr_1' }
  ],
  issues: [
    { id: 'iss_1', title: 'Implement S3 Uploads', status: 'IN_PROGRESS', priority: 'HIGH', workspaceId: 'ws_1', assigneeId: 'usr_3' },
    { id: 'iss_2', title: 'Fix N+1 Query in Feed', status: 'TODO', priority: 'URGENT', workspaceId: 'ws_1', assigneeId: 'usr_3' }
  ],
  analytics: {
    latency: 45,
    queryCount: 124,
    activeSessions: 8
  }
};

// --- Middleware: Authentication ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden: Invalid token' });
    req.user = user;
    next();
  });
};

// --- Middleware: Role-Based Access Control (RBAC) ---
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: Requires one of roles [${roles.join(', ')}]` });
    }
    next();
  };
};

// --- Endpoints ---

// 1. Health & Architecture Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    mode: pool ? 'Neon PostgreSQL (Production)' : 'In-Memory RAM DB (Simulation)',
    memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
    cloudStorage: process.env.S3_BUCKET_NAME ? `AWS S3 Simulation (${process.env.S3_BUCKET_NAME})` : 'None configured'
  });
});

// 2. Auth Login (Returns JWT)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

// 3. Simulated AWS S3 Presigned URL Generator
app.post('/api/storage/presign', authenticateToken, (req, res) => {
  const { filename, fileType, size } = req.body;
  
  if (!filename || !fileType) {
    return res.status(400).json({ error: 'Filename and fileType are required' });
  }
  
  if (size && size > 10 * 1024 * 1024) {
    return res.status(413).json({ error: 'Payload Too Large: Max file size is 10MB' });
  }
  
  const bucket = process.env.S3_BUCKET_NAME || 'mock-bucket';
  const region = process.env.AWS_REGION || 'us-east-1';
  const key = `uploads/${Date.now()}_${filename.replace(/\s+/g, '_')}`;
  
  // Simulate the AWS SDK response
  const presignedPutUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=MOCK_CREDENTIAL&X-Amz-Signature=MOCK_SIGNATURE&X-Amz-Expires=3600`;
  const finalReadUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  
  res.json({
    uploadUrl: presignedPutUrl,
    finalUrl: finalReadUrl,
    expiresIn: 3600
  });
});

// 4. Issues CRUD (Protected)
app.get('/api/issues', authenticateToken, async (req, res) => {
  try {
    if (pool) {
      const { rows } = await pool.query(
        'SELECT * FROM issues WHERE workspace_id = $1 ORDER BY created_at DESC LIMIT 50',
        [req.user.workspaceId || 'default']
      );
      return res.json({ success: true, data: rows, source: 'postgresql' });
    }
    // Fallback to mock
    return res.json({ success: true, data: db.issues, source: 'in-memory' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/issues', authenticateToken, async (req, res) => {
  try {
    const { title, priority, status, workspaceId } = req.body;
    
    if (pool) {
      const { rows } = await pool.query(
        'INSERT INTO issues (title, priority, status, workspace_id, assignee) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, priority || 'MEDIUM', status || 'TODO', workspaceId || 'ws_1', req.user.id]
      );
      return res.status(201).json({ success: true, data: rows[0], source: 'postgresql' });
    }
    
    const newIssue = {
      id: `iss_${Date.now()}`,
      title,
      priority: priority || 'MEDIUM',
      status: status || 'TODO',
      workspaceId: workspaceId || 'ws_1',
      assigneeId: req.user.id
    };
    db.issues.push(newIssue);
    return res.status(201).json({ success: true, data: newIssue, source: 'in-memory' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/issues/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (pool) {
      const updates = [];
      const values = [];
      let i = 1;
      
      for (const [key, value] of Object.entries(req.body)) {
        updates.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
      
      if (updates.length === 0) return res.json({ success: true, message: 'No updates provided' });
      
      values.push(id);
      updates.push(`updated_at = NOW()`);
      
      const { rows } = await pool.query(
        `UPDATE issues SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
        values
      );
      
      if (rows.length === 0) return res.status(404).json({ error: 'Issue not found' });
      return res.json({ success: true, data: rows[0], source: 'postgresql' });
    }
    
    const issueIndex = db.issues.findIndex(i => i.id === id);
    if (issueIndex === -1) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    db.issues[issueIndex] = { ...db.issues[issueIndex], ...req.body };
    return res.json({ success: true, data: db.issues[issueIndex], source: 'in-memory' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/issues/:id', authenticateToken, requireRole('OWNER', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (pool) {
      const { rowCount } = await pool.query('DELETE FROM issues WHERE id = $1', [id]);
      if (rowCount === 0) return res.status(404).json({ error: 'Issue not found' });
      return res.json({ success: true, message: 'Issue deleted successfully', source: 'postgresql' });
    }
    
    const issueIndex = db.issues.findIndex(i => i.id === id);
    if (issueIndex === -1) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    db.issues.splice(issueIndex, 1);
    return res.json({ success: true, message: 'Issue deleted successfully', source: 'in-memory' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Analytics Dashboard
app.get('/api/analytics/dashboard', authenticateToken, (req, res) => {
  res.json(db.analytics);
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n\uD83D\uDE80 [Lesson 47 Capstone Engine] API Simulation running on http://localhost:${PORT}`);
  console.log(`\n======================================================`);
  console.log(`Database Mode: ${pool ? '\uD83D\uDC18 PostgreSQL (Neon)' : '\uD83D\uDCBE In-Memory Mock'}`);
  console.log(`Cloud Storage: ${process.env.S3_BUCKET_NAME ? '\uD83D\uDCE6 S3 Simulator Active' : '\u2601\uFE0F AWS S3 Connected'}`);
  console.log(`\nAvailable Endpoints:`);
  console.log(`  GET  /api/health`);
  console.log(`  POST /api/auth/login`);
  console.log(`  POST /api/storage/presign`);
  console.log(`  GET  /api/issues`);
  console.log(`======================================================\n`);
});
