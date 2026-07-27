import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3015;
const JWT_SECRET = process.env.JWT_SECRET || 'lesson47_super_secret_capstone_key_2026';
const IS_POSTGRES = Boolean(process.env.DATABASE_URL);

// --- In-Memory Database Simulation ---
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
    mode: IS_POSTGRES ? 'Neon PostgreSQL (Production)' : 'In-Memory RAM DB (Simulation)',
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
app.get('/api/issues', authenticateToken, (req, res) => {
  res.json(db.issues);
});

app.post('/api/issues', authenticateToken, (req, res) => {
  const { title, priority, status, workspaceId } = req.body;
  const newIssue = {
    id: `iss_${Date.now()}`,
    title,
    priority: priority || 'MEDIUM',
    status: status || 'TODO',
    workspaceId: workspaceId || 'ws_1',
    assigneeId: req.user.id
  };
  db.issues.push(newIssue);
  res.status(201).json(newIssue);
});

app.patch('/api/issues/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const issueIndex = db.issues.findIndex(i => i.id === id);
  
  if (issueIndex === -1) {
    return res.status(404).json({ error: 'Issue not found' });
  }
  
  db.issues[issueIndex] = { ...db.issues[issueIndex], ...req.body };
  res.json(db.issues[issueIndex]);
});

app.delete('/api/issues/:id', authenticateToken, requireRole('OWNER', 'ADMIN'), (req, res) => {
  const { id } = req.params;
  const issueIndex = db.issues.findIndex(i => i.id === id);
  
  if (issueIndex === -1) {
    return res.status(404).json({ error: 'Issue not found' });
  }
  
  db.issues.splice(issueIndex, 1);
  res.json({ message: 'Issue deleted successfully' });
});

// 5. Analytics Dashboard
app.get('/api/analytics/dashboard', authenticateToken, (req, res) => {
  res.json(db.analytics);
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 [Lesson 47 Capstone Engine] API Simulation running on http://localhost:${PORT}`);
  console.log(`\n======================================================`);
  console.log(`Database Mode: ${IS_POSTGRES ? '🟢 Neon PostgreSQL connected' : '🟡 In-Memory RAM simulation'}`);
  console.log(`Cloud Storage: ${process.env.S3_BUCKET_NAME ? '🟢 S3 Simulator Active' : '🔴 No Bucket Configured'}`);
  console.log(`\nAvailable Endpoints:`);
  console.log(`  GET  /api/health`);
  console.log(`  POST /api/auth/login`);
  console.log(`  POST /api/storage/presign`);
  console.log(`  GET  /api/issues`);
  console.log(`======================================================\n`);
});
