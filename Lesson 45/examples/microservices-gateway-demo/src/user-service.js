import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3010;
const dbUrl = process.env.DATABASE_URL;

app.use(express.json());

let pool;
if (dbUrl) {
  pool = new pg.Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
}

// In-memory fallback
const usersStore = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', createdAt: new Date() },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user', createdAt: new Date() },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user', createdAt: new Date() }
];

app.get('/health', (req, res) => {
  res.json({ service: 'user-service', status: 'healthy', db: dbUrl ? 'neon-pg' : 'in-memory' });
});

app.get('/users', async (req, res) => {
  if (pool) {
    try {
      const result = await pool.query('SELECT * FROM ms_users');
      return res.json(result.rows);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'DB Error' });
    }
  }
  res.json(usersStore);
});

app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (pool) {
    try {
      const result = await pool.query('SELECT * FROM ms_users WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
      return res.json(result.rows[0]);
    } catch (e) {
      return res.status(500).json({ error: 'DB Error' });
    }
  }
  
  const user = usersStore.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  if (pool) {
    // simplified DB handling for demo
    return res.status(501).json({ error: 'Not implemented in DB mode for demo' });
  }
  const newUser = { id: usersStore.length + 1, name, email, role: 'user', createdAt: new Date() };
  usersStore.push(newUser);
  res.status(201).json(newUser);
});

app.listen(PORT, async () => {
  console.log(`👤 User Service running on port ${PORT}`);
  console.log(`Storage mode: ${dbUrl ? 'Neon PostgreSQL' : 'In-Memory'}`);
  
  if (pool) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS ms_users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100),
          email VARCHAR(100) UNIQUE,
          role VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Database initialized.');
    } catch (e) {
      console.error('Failed to init DB:', e.message);
    }
  }
});
