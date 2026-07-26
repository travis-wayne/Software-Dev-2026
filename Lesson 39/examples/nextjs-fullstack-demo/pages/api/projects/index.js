// pages/api/projects/index.js — Projects Collection Endpoint (GET all, POST create)
import db from '../../../lib/db';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return handleGetProjects(req, res);
    
    case 'POST':
      return handleCreateProject(req, res);
    
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ 
        success: false, 
        error: `Method ${req.method} Not Allowed. Use GET or POST.` 
      });
  }
}

async function handleGetProjects(req, res) {
  try {
    const rows = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    return res.status(200).json({ 
      success: true, 
      count: rows.length, 
      data: rows 
    });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve projects from database' 
    });
  }
}

async function handleCreateProject(req, res) {
  // 1. Enforce API Key Authentication for POST creations
  const apiKey = req.headers['x-api-key'] || req.headers.authorization?.replace('Bearer ', '');
  const secretKey = process.env.API_SECRET_KEY || 'secret_key_2026';

  if (!apiKey || apiKey !== secretKey) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized. Please provide valid X-API-Key header to create projects.',
      hint: 'Default test key is: secret_key_2026'
    });
  }

  // 2. Validate input payload
  const { title, description, tech_stack, github_url, live_url } = req.body || {};
  
  if (!title || !description || !tech_stack) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation Error: title, description, and tech_stack are required fields.' 
    });
  }

  try {
    const newId = `proj_${Date.now()}`;
    await db.execute(
      `INSERT INTO projects (id, title, description, tech_stack, github_url, live_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [newId, title.trim(), description.trim(), tech_stack.trim(), github_url || null, live_url || null]
    );

    // Fetch the created item to return clean data
    const created = await db.query('SELECT * FROM projects WHERE id = ?', [newId]);

    return res.status(201).json({ 
      success: true, 
      message: 'Project successfully created', 
      data: created[0] || { id: newId, title, description, tech_stack, github_url, live_url } 
    });
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to insert new project into database',
      details: error.message
    });
  }
}
