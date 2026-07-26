// pages/api/status.js — Database & Serverless Diagnostic Endpoint
import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const rows = await db.query('SELECT count(*) as count FROM projects');
    const projectCount = rows[0]?.count || 0;

    return res.status(200).json({
      success: true,
      status: 'online',
      timestamp: new Date().toISOString(),
      database: {
        adapter: db.type,
        connected: db.connected,
        projectCount: Number(projectCount)
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Status endpoint error:', error);
    return res.status(500).json({
      success: false,
      status: 'error',
      error: 'Failed to inspect database status',
      details: error.message
    });
  }
}
