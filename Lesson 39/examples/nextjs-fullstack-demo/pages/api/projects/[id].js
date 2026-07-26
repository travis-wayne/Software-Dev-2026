// pages/api/projects/[id].js — Single Project Endpoint (GET, PUT, DELETE)
import db from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: 'Project ID parameter is required' });
  }

  switch (req.method) {
    case 'GET':
      return handleGetSingle(id, res);
    
    case 'PUT':
      return handleUpdateProject(id, req, res);
    
    case 'DELETE':
      return handleDeleteProject(id, req, res);
    
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ 
        success: false, 
        error: `Method ${req.method} Not Allowed on project resource.` 
      });
  }
}

async function handleGetSingle(id, res) {
  try {
    const rows = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, error: `Project with ID '${id}' not found` });
    }
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(`GET /api/projects/${id} error:`, error);
    return res.status(500).json({ success: false, error: 'Failed to query project by ID' });
  }
}

async function handleUpdateProject(id, req, res) {
  // 1. Enforce API Key Authentication for PUT updates
  const apiKey = req.headers['x-api-key'] || req.headers.authorization?.replace('Bearer ', '');
  const secretKey = process.env.API_SECRET_KEY || 'secret_key_2026';

  if (!apiKey || apiKey !== secretKey) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized. Please provide valid X-API-Key header to update projects.' 
    });
  }

  // 2. Validate existence
  const existing = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
  if (!existing || existing.length === 0) {
    return res.status(404).json({ success: false, error: `Cannot update: Project '${id}' not found` });
  }

  const { title, description, tech_stack, github_url, live_url } = req.body || {};
  if (!title || !description || !tech_stack) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation Error: title, description, and tech_stack cannot be empty.' 
    });
  }

  try {
    await db.execute(
      `UPDATE projects 
       SET title = ?, description = ?, tech_stack = ?, github_url = ?, live_url = ? 
       WHERE id = ?`,
      [title.trim(), description.trim(), tech_stack.trim(), github_url || null, live_url || null, id]
    );

    const updated = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    return res.status(200).json({ 
      success: true, 
      message: `Project '${id}' updated successfully`, 
      data: updated[0] 
    });
  } catch (error) {
    console.error(`PUT /api/projects/${id} error:`, error);
    return res.status(500).json({ success: false, error: 'Failed to update project' });
  }
}

async function handleDeleteProject(id, req, res) {
  // 1. Enforce API Key Authentication for DELETE operations
  const apiKey = req.headers['x-api-key'] || req.headers.authorization?.replace('Bearer ', '');
  const secretKey = process.env.API_SECRET_KEY || 'secret_key_2026';

  if (!apiKey || apiKey !== secretKey) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized. Please provide valid X-API-Key header to delete projects.' 
    });
  }

  try {
    const existing = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, error: `Cannot delete: Project '${id}' not found` });
    }

    await db.execute('DELETE FROM projects WHERE id = ?', [id]);

    return res.status(200).json({ 
      success: true, 
      message: `Project '${id}' successfully deleted`,
      deletedId: id
    });
  } catch (error) {
    console.error(`DELETE /api/projects/${id} error:`, error);
    return res.status(500).json({ success: false, error: 'Failed to delete project from database' });
  }
}
