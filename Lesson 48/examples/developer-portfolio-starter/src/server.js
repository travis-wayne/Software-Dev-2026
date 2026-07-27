import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3018;
const OWNER_NAME = process.env.PORTFOLIO_OWNER_NAME || "Software-Dev-2026 Graduate";

// Middleware
app.use(cors());
app.use(express.json());

const { Pool } = require('pg');
let dbPool = null;

async function initDB() {
  if (!process.env.DATABASE_URL) return;
  try {
    dbPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        subject VARCHAR(500),
        message TEXT,
        receipt_id VARCHAR(100),
        submitted_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('  🐘 Contact submissions DB connected!');
  } catch (err) {
    console.error('  ⚠️  DB init failed:', err.message);
    dbPool = null;
  }
}

// Optional: pnpm add resend (only if RESEND_API_KEY is set)
async function sendEmailNotification(contactData) {
  if (!process.env.RESEND_API_KEY) {
    console.log('  📬 Email simulation (no RESEND_API_KEY set):');
    console.log('  To:', process.env.CONTACT_EMAIL || 'developer@example.com');
    console.log('  Subject:', contactData.subject);
    console.log('  From:', contactData.email);
    return { simulated: true };
  }
  
  try {
    // Dynamic require so server starts even without resend installed
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const { data } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',  // Use verified domain in production
      to: process.env.CONTACT_EMAIL || 'developer@example.com',
      subject: `[Portfolio Contact] ${contactData.subject}`,
      html: `
        <h2>New Portfolio Contact</h2>
        <p><strong>From:</strong> ${contactData.name} &lt;${contactData.email}&gt;</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <hr>
        <p>${contactData.message.replace(/\n/g, '<br>')}</p>
      `
    });
    return { sent: true, id: data.id };
  } catch (err) {
    console.error('Email send failed:', err.message);
    return { sent: false, error: err.message };
  }
}


// --- Mock Database / Portfolio Data ---

const projects = [
  {
    id: "proj_01",
    name: "DevPulse - Issue Tracker",
    description: "A collaborative SaaS issue tracker with optimistic UI updates and real-time WebSockets.",
    techStack: ["Next.js 16", "TypeScript", "Prisma", "PostgreSQL", "TailwindCSS", "WebSockets"],
    metrics: [
      "Reduced database query latency by 85% via Redis caching.",
      "Handled 10,000 simulated daily requests.",
      "Improved perceived application responsiveness by 40%."
    ],
    githubUrl: "https://github.com/example/devpulse",
    liveUrl: "https://devpulse.example.com",
    caseStudy: "Architected a full-stack multi-tenant issue tracker. Solved N+1 query problems using Prisma dataloader patterns. Implemented secure presigned S3 upload pipelines for attachments."
  },
  {
    id: "proj_02",
    name: "ProStack - Developer Portfolio Engine",
    description: "A dynamic portfolio generation API that serves structured resume data and case studies.",
    techStack: ["Node.js", "Express", "REST API", "Docker"],
    metrics: [
      "Achieved 99.9% API uptime.",
      "Responses delivered in < 50ms."
    ],
    githubUrl: "https://github.com/example/prostack",
    liveUrl: "https://api.prostack.example.com",
    caseStudy: "Built a fast, lightweight Express API to decouple frontend presentation from backend data, allowing seamless integration with any UI framework."
  },
  {
    id: "proj_03",
    name: "OmniMart - E-Commerce Architecture",
    description: "A highly scalable e-commerce backend built with microservices and message queues.",
    techStack: ["Node.js", "RabbitMQ", "MongoDB", "Kubernetes"],
    metrics: [
      "Processed 500 concurrent checkout events without data loss.",
      "Scaled gracefully under synthetic load tests."
    ],
    githubUrl: "https://github.com/example/omnimart",
    liveUrl: "https://omnimart.example.com",
    caseStudy: "Engineered an event-driven microservices architecture to handle sudden spikes in e-commerce traffic. Used RabbitMQ to decouple order processing from inventory management."
  }
];

const skills = {
  frontend: [
    { name: "React 19", proficiency: 95 },
    { name: "Next.js App Router", proficiency: 90 },
    { name: "TypeScript", proficiency: 85 },
    { name: "TailwindCSS", proficiency: 95 }
  ],
  backend: [
    { name: "Node.js / Express", proficiency: 90 },
    { name: "REST / GraphQL", proficiency: 85 },
    { name: "Prisma ORM", proficiency: 90 },
    { name: "Python / Django", proficiency: 70 }
  ],
  database: [
    { name: "PostgreSQL", proficiency: 85 },
    { name: "MongoDB", proficiency: 80 },
    { name: "Redis", proficiency: 75 }
  ],
  devops: [
    { name: "Docker", proficiency: 80 },
    { name: "Kubernetes", proficiency: 65 },
    { name: "AWS (S3, EC2, Lambda)", proficiency: 75 },
    { name: "CI/CD (GitHub Actions)", proficiency: 85 }
  ]
};

// --- API Endpoints ---

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    owner: OWNER_NAME,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 2. Project Showcase Endpoint
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// 3. Skills Radar Endpoint
app.get('/api/skills', (req, res) => {
  res.json({
    success: true,
    data: skills
  });
});

// 4. Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Name, email, and message are required fields."
    });
  }

  const receiptId = `msg_${Date.now()}`;

  // Log to database if connected
  if (dbPool) {
    try {
      await dbPool.query(
        'INSERT INTO contact_submissions (name, email, subject, message, receipt_id) VALUES ($1, $2, $3, $4, $5)',
        [name, email, subject || 'No Subject', message, receiptId]
      );
    } catch (err) {
      console.error('Failed to log submission to DB:', err);
    }
  }

  // Send email notification
  await sendEmailNotification({ name, email, subject: subject || 'No Subject', message });

  res.status(201).json({
    success: true,
    message: "Thank you for reaching out! Your message has been sent successfully.",
    receiptId,
    timestamp: new Date().toISOString()
  });
});

// GET /api/contact/submissions — Admin view of all contact submissions
app.get('/api/contact/submissions', async (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_TOKEN && process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  if (dbPool) {
    const { rows } = await dbPool.query(
      'SELECT id, name, email, subject, receipt_id, submitted_at FROM contact_submissions ORDER BY submitted_at DESC LIMIT 100'
    );
    return res.json({ success: true, data: rows, source: 'postgresql' });
  }
  res.json({ success: true, data: [], message: 'No DB connected — set DATABASE_URL to store submissions' });
});

// --- Server Startup ---

app.listen(PORT, async () => {
  await initDB();
  console.log(`\n======================================================`);
  console.log(`🚀 Developer Portfolio API is running!`);
  console.log(`👤 Owner: ${OWNER_NAME}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`======================================================`);
  console.log(`Available Endpoints:`);
  console.log(`  GET  /api/health`);
  console.log(`  GET  /api/projects`);
  console.log(`  GET  /api/skills`);
  console.log(`  POST /api/contact`);
  console.log(`  GET  /api/contact/submissions`);
  console.log(`======================================================\n`);
});
