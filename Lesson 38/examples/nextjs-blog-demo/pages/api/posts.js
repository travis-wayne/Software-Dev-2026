// pages/api/posts.js
// Next.js API Route — runs on the server, never in the browser
// Connects to Neon PostgreSQL if DATABASE_URL is set, otherwise uses mock data

let pool = null;

async function getPool() {
  if (pool) return pool;
  
  if (!process.env.DATABASE_URL) {
    return null; // Will use mock data fallback
  }
  
  const { Pool } = await import('pg');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  
  // Create table and seed if empty
  await pool.query(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      excerpt TEXT,
      body TEXT,
      author VARCHAR(100) DEFAULT 'Anonymous',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  const { rows } = await pool.query('SELECT COUNT(*) FROM blog_posts');
  if (parseInt(rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO blog_posts (title, excerpt, body, author) VALUES
      ('Getting Started with Next.js', 'Learn how Next.js revolutionises React development with SSR and SSG.', 'Next.js is a powerful framework built on top of React...', 'Tutor Travis'),
      ('Understanding Server-Side Rendering', 'SSR generates HTML on the server for every request, improving SEO and performance.', 'When a user visits an SSR page...', 'Tutor Travis'),
      ('Static Site Generation Deep Dive', 'SSG pre-renders pages at build time — the fastest way to serve web content.', 'Static pages are generated once during npm run build...', 'Student Demo'),
      ('Next.js API Routes Explained', 'Build full backend APIs directly inside your Next.js project — no separate Express server.', 'API Routes in Next.js are serverless functions...', 'Student Demo'),
      ('Deploying Next.js to Vercel', 'Vercel is built by the creators of Next.js. One-click deployment, zero configuration.', 'To deploy, simply connect your GitHub repo to Vercel...', 'Tutor Travis')
    `);
  }
  
  return pool;
}

const MOCK_POSTS = [
  { id: 1, title: 'Getting Started with Next.js', excerpt: 'Learn how Next.js revolutionises React development with SSR and SSG.', author: 'Demo Mode', created_at: new Date().toISOString() },
  { id: 2, title: 'Understanding Server-Side Rendering', excerpt: 'SSR generates HTML on the server for every request, improving SEO.', author: 'Demo Mode', created_at: new Date().toISOString() },
  { id: 3, title: 'Static Site Generation Deep Dive', excerpt: 'SSG pre-renders pages at build time — the fastest way to serve content.', author: 'Demo Mode', created_at: new Date().toISOString() },
];

export default async function handler(req, res) {
  const db = await getPool();
  
  if (req.method === 'GET') {
    if (!db) {
      // Fallback: no DATABASE_URL set
      return res.status(200).json({ posts: MOCK_POSTS, source: 'mock-data' });
    }
    const { rows } = await db.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
    return res.status(200).json({ posts: rows, source: 'neon-postgresql' });
  }
  
  if (req.method === 'POST') {
    const { title, excerpt, body, author } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (!db) return res.status(503).json({ error: 'Database not configured. Set DATABASE_URL in .env.local' });
    
    const { rows } = await db.query(
      'INSERT INTO blog_posts (title, excerpt, body, author) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, excerpt || '', body || '', author || 'Anonymous']
    );
    return res.status(201).json({ post: rows[0] });
  }
  
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
