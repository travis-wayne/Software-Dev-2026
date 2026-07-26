/**
 * Lesson 39 — App Router API Route (Next.js 13+)
 * Compare this with pages/api/projects/index.js!
 * 
 * Key differences from Pages Router:
 * - Named exports per HTTP method (no switch-case!)
 * - Request is a Web API Request object (not Node.js req)
 * - Returns NextResponse.json() instead of res.json()
 */
import { NextResponse } from 'next/server';
import db from '../../../lib/db';

// GET /api/projects — App Router style
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit')) || 10;
    const { rows } = await db.query(
      'SELECT * FROM projects ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return NextResponse.json({ projects: rows, count: rows.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/projects — App Router style
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, status = 'active' } = body;
    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }
    const { rows } = await db.query(
      'INSERT INTO projects (name, description, status) VALUES ($1, $2, $3) RETURNING *',
      [name, description, status]
    );
    return NextResponse.json({ project: rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
