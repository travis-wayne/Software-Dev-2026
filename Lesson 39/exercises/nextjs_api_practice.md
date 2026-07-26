# Lesson 39 — Practice Exercises: Next.js API Routes & Database Integration

These exercises are designed to reinforce your understanding of Next.js serverless API routes, HTTP routing, database queries, and security.

---

## Exercise 1: File-System Routing Mapping

For each of the following HTTP requests made by a frontend browser, write the exact filename and path inside the `pages/` directory that Next.js will execute.

1. `GET /api/health`
2. `POST /api/users/login`
3. `GET /api/products/49102`
4. `PUT /api/articles/2026/react-19-release`

<details>
<summary><strong>View Solution</strong></summary>

1. `pages/api/health.js` (or `pages/api/health/index.js`)
2. `pages/api/users/login.js`
3. `pages/api/products/[id].js` (where `req.query.id = "49102"`)
4. `pages/api/articles/[year]/[slug].js` (where `req.query.year = "2026"` and `req.query.slug = "react-19-release"`)

</details>

---

## Exercise 2: The Multi-Method Boilerplate

You are building an endpoint at `pages/api/feedback.js`.
1. If the user sends a `GET` request, return a JSON array of mock feedback items with status `200 OK`.
2. If the user sends a `POST` request, extract `email` and `message` from `req.body`. If either is missing, return `400 Bad Request`. Otherwise, return `201 Created` with the created feedback item.
3. If any other HTTP method is used, return `405 Method Not Allowed` and set the `Allow` header to `['GET', 'POST']`.

Write the complete code for `pages/api/feedback.js`.

<details>
<summary><strong>View Solution</strong></summary>

```javascript
// pages/api/feedback.js
export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const mockFeedback = [
        { id: 1, email: 'travis@wayne.com', message: 'Great course structure!' },
        { id: 2, email: 'alice@dev.org', message: 'Love the sleek UI design.' }
      ];
      return res.status(200).json({ success: true, data: mockFeedback });

    case 'POST':
      const { email, message } = req.body;
      if (!email || !message) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email and message are required fields.' 
        });
      }
      const newItem = { id: Date.now(), email, message, createdAt: new Date() };
      return res.status(201).json({ success: true, data: newItem });

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ 
        success: false, 
        error: `Method ${req.method} Not Allowed` 
      });
  }
}
```

</details>

---

## Exercise 3: Dynamic Route Parameter Extraction

You have created a dynamic API route at `pages/api/tasks/[taskId].js`.
Write a handler that intercepts a `DELETE` request. It should:
1. Extract `taskId` from the request query.
2. Check if `taskId` is a valid number. If not, return `400 Bad Request` with an error message.
3. Simulate deleting the task and return a `200 OK` JSON response confirming the deletion of `taskId`.

<details>
<summary><strong>View Solution</strong></summary>

```javascript
// pages/api/tasks/[taskId].js
export default async function handler(req, res) {
  const { taskId } = req.query;

  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Validate that taskId is a number
  if (isNaN(Number(taskId))) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid Task ID. Task ID must be numeric.' 
    });
  }

  // Simulate deletion
  console.log(`Deleting task with ID: ${taskId}`);

  return res.status(200).json({ 
    success: true, 
    message: `Task ${taskId} successfully deleted.` 
  });
}
```

</details>

---

## Exercise 4: Preventing SQL Injection in API Routes

The following Next.js API route is dangerously vulnerable to SQL Injection:

```javascript
// VULNERABLE CODE — DO NOT USE
export default async function handler(req, res) {
  const { category } = req.query;
  const query = `SELECT * FROM products WHERE category = '${category}'`;
  const rows = await db.query(query);
  res.status(200).json(rows);
}
```

1. Explain how an attacker could exploit this endpoint if they passed a malicious string into `?category=`.
2. Rewrite the handler using **parameterized queries** and proper error handling (`try/catch`).

<details>
<summary><strong>View Solution</strong></summary>

### 1. The Exploit
If an attacker passes `?category=' OR '1'='1`, the concatenated SQL string becomes:
```sql
SELECT * FROM products WHERE category = '' OR '1'='1'
```
Since `'1'='1'` is always true, the database will bypass the category filter and return **every single product** in the database, including unreleased or private inventory items. Worse, passing `'; DROP TABLE products; --` could destroy the entire table!

### 2. The Parameterized Fix
```javascript
// SAFE PARAMETERIZED CODE
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ error: 'Category query parameter is required' });
  }

  try {
    // Pass category as an array parameter ($1 or ? depending on driver)
    const rows = await db.query('SELECT * FROM products WHERE category = ?', [category]);
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
```

</details>

---

## Exercise 5: Reusable API Key Authentication

Instead of duplicating API key verification checks in every single route file, professional developers create higher-order wrapper functions or middleware.

Write a higher-order function called `withApiKey(handler)` in a file called `lib/withApiKey.js`.
- It should check if the incoming request has a valid header: `x-api-key: my_secret_key_2026`.
- If the header is missing or incorrect, return `401 Unauthorized` immediately.
- If the header is valid, invoke and return the wrapped API handler.

Show how you would wrap an API route with this function.

<details>
<summary><strong>View Solution</strong></summary>

### 1. The Middleware Wrapper (`lib/withApiKey.js`)
```javascript
// lib/withApiKey.js
export function withApiKey(handler) {
  return async (req, res) => {
    const providedKey = req.headers['x-api-key'];
    const expectedKey = process.env.API_SECRET_KEY || 'my_secret_key_2026';

    if (!providedKey || providedKey !== expectedKey) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized access. Valid X-API-Key header required.'
      });
    }

    // Pass execution to the original route handler
    return handler(req, res);
  };
}
```

### 2. Using it in a Route (`pages/api/admin/clear-cache.js`)
```javascript
// pages/api/admin/clear-cache.js
import { withApiKey } from '../../../lib/withApiKey';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // This code only runs if withApiKey verification succeeded!
  return res.status(200).json({ success: true, message: 'System cache cleared successfully.' });
}

// Export the wrapped handler
export default withApiKey(handler);
```

</details>

---

## Exercise 6: Frontend Integration with Relative Paths

You are building a React component inside your Next.js frontend to delete an item by calling `DELETE /api/projects/[id]`.

Write an async function `deleteProject(id, apiKey)` that:
1. Makes a `fetch()` request to `/api/projects/${id}` with method `DELETE`.
2. Passes the `apiKey` inside the `X-API-Key` HTTP header.
3. Parses the JSON response.
4. Alerts the user on error, or returns the success message on completion.

<details>
<summary><strong>View Solution</strong></summary>

```javascript
async function deleteProject(id, apiKey) {
  try {
    // Note: We use the relative path '/api/...' because frontend and backend share the domain!
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      }
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle HTTP error statuses (400, 401, 404, 500)
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    console.log('Success:', data.message);
    return data;
  } catch (error) {
    console.error('Failed to delete project:', error);
    alert(`Error deleting project: ${error.message}`);
    return null;
  }
}
```

</details>

---

## Exercise 7: Complete Portfolio CRUD Challenge

Your challenge is to architect the backend API for a Developer Portfolio app. You need to support 5 operations across 2 files:
1. `pages/api/projects/index.js`:
   - `GET`: Return all projects sorted by `created_at DESC`.
   - `POST`: Create a new project (Protected by API Key).
2. `pages/api/projects/[id].js`:
   - `GET`: Return a single project by ID.
   - `PUT`: Update a project's title and description (Protected by API Key).
   - `DELETE`: Remove a project by ID (Protected by API Key).

Write out the complete structure and implementation for both files using the dual-mode database adapter (`lib/db.js`).

<details>
<summary><strong>View Solution</strong></summary>

### 1. `pages/api/projects/index.js`
```javascript
import db from '../../../lib/db';
import { withApiKey } from '../../../lib/withApiKey';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const rows = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
        return res.status(200).json({ success: true, count: rows.length, data: rows });
      } catch (err) {
        return res.status(500).json({ success: false, error: 'Database error' });
      }

    case 'POST':
      // Verify API Key manually or via wrapper
      if (req.headers['x-api-key'] !== (process.env.API_SECRET_KEY || 'secret_2026')) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
      try {
        const { id, title, description, tech_stack } = req.body;
        if (!title || !description) {
          return res.status(400).json({ success: false, error: 'Missing title or description' });
        }
        const projId = id || `proj_${Date.now()}`;
        await db.query(
          'INSERT INTO projects (id, title, description, tech_stack) VALUES (?, ?, ?, ?)',
          [projId, title, description, tech_stack || 'React, Next.js']
        );
        return res.status(201).json({ success: true, data: { id: projId, title, description } });
      } catch (err) {
        return res.status(500).json({ success: false, error: 'Insert failed' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
```

### 2. `pages/api/projects/[id].js`
```javascript
import db from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  const isProtected = ['PUT', 'DELETE'].includes(req.method);

  if (isProtected && req.headers['x-api-key'] !== (process.env.API_SECRET_KEY || 'secret_2026')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      const rows = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ success: false, error: 'Not found' });
      return res.status(200).json({ success: true, data: rows[0] });

    case 'PUT':
      const { title, description } = req.body;
      await db.query('UPDATE projects SET title = ?, description = ? WHERE id = ?', [title, description, id]);
      return res.status(200).json({ success: true, message: 'Updated successfully' });

    case 'DELETE':
      await db.query('DELETE FROM projects WHERE id = ?', [id]);
      return res.status(200).json({ success: true, message: 'Deleted successfully' });

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
```

</details>
