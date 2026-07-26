// server.js — Lesson 42: AWS S3 Object Storage & Presigned URL API
// Demonstrates dual-mode adapter: real @aws-sdk/client-s3 when credentials exist, or offline Mock S3 otherwise!

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { mockS3 } from "./mockS3.js";

// Supabase Storage client (zero-credit-card real cloud storage!)
let supabaseClient = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  import('@supabase/supabase-js').then(({ createClient }) => {
    supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    console.log('✅ Supabase Storage connected!');
  }).catch(() => console.log('⚠️ Supabase SDK not installed. Run: pnpm add @supabase/supabase-js'));
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Detect whether to use real AWS S3 Cloud or Offline Mock S3
const hasAwsCredentials = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_S3_BUCKET);
let s3Client = null;

if (hasAwsCredentials) {
  s3Client = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });
  console.log(`☁️ [AWS S3 Cloud Mode] Connected to live bucket '${process.env.AWS_S3_BUCKET}' in region '${process.env.AWS_REGION || "us-east-1"}'.`);
} else {
  console.log(`🟢 [Offline Mock S3 Mode] Zero-setup local storage active. Presigned URLs will target simulated bucket.`);
}

/**
 * GET /api/status — Check current storage mode and bucket stats
 */
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    mode: hasAwsCredentials ? "AWS_S3_CLOUD" : "OFFLINE_MOCK_S3",
    bucket: hasAwsCredentials ? process.env.AWS_S3_BUCKET : mockS3.bucketName,
    region: process.env.AWS_REGION || "us-east-1",
    totalObjects: hasAwsCredentials ? "Cloud Bucket Managed" : mockS3.listObjects().length,
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/supabase/upload
 * Uploads a file directly to Supabase Storage bucket
 * Zero credit card required! 5GB free tier.
 */
app.post('/api/supabase/upload', async (req, res) => {
  if (!supabaseClient) {
    // Simulate successful upload with mock response
    const mockPath = `files/${Date.now()}-demo-upload.jpg`;
    return res.json({
      success: true,
      mode: 'mock',
      path: mockPath,
      publicUrl: `https://placeholder.supabase.co/storage/v1/object/public/lesson-42-uploads/${mockPath}`,
      message: 'Mock upload successful! Set SUPABASE_URL and SUPABASE_ANON_KEY in .env for real cloud upload.'
    });
  }

  try {
    const { filename = 'test-upload.jpg', contentType = 'image/jpeg' } = req.body;
    const path = `files/${Date.now()}-${filename}`;
    // Simulate file content (in real app this would be multipart form data)
    const mockContent = Buffer.from('Lesson 42 Supabase Storage Upload Demo');
    
    const { data, error } = await supabaseClient.storage
      .from('lesson-42-uploads')
      .upload(path, mockContent, { contentType, upsert: true });

    if (error) throw error;

    const { data: urlData } = supabaseClient.storage
      .from('lesson-42-uploads')
      .getPublicUrl(data.path);

    res.json({ success: true, mode: 'supabase-cloud', path: data.path, publicUrl: urlData.publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/upload-url — Generate cryptographic Presigned URL for direct client-to-cloud upload
 * Expected body: { "filename": "photo.jpg", "fileType": "image/jpeg" }
 */
app.post("/api/upload-url", async (req, res) => {
  try {
    const { filename, fileType } = req.body;
    if (!filename || !fileType) {
      return res.status(400).json({ error: "Missing required fields: 'filename' and 'fileType'" });
    }

    const uniqueKey = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    if (hasAwsCredentials) {
      // Real AWS S3 Presigned URL generation
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: uniqueKey,
        ContentType: fileType
      });
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 }); // 15 minutes
      
      return res.json({
        uploadUrl: signedUrl,
        key: uniqueKey,
        bucket: process.env.AWS_S3_BUCKET,
        expiresInSeconds: 900,
        mode: "AWS_S3_CLOUD"
      });
    } else {
      // Offline Mock S3 Presigned URL generation
      const hostUrl = `${req.protocol}://${req.get("host")}`;
      const mockResult = await mockS3.generatePresignedUrl(uniqueKey, fileType, 900, hostUrl);
      return res.json(mockResult);
    }
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    res.status(500).json({ error: "Failed to generate Presigned URL", details: error.message });
  }
});

/**
 * GET /api/files — List all uploaded files in our mock bucket (or return instructions for real S3)
 */
app.get("/api/files", (req, res) => {
  if (hasAwsCredentials) {
    res.json({
      mode: "AWS_S3_CLOUD",
      message: "In real AWS Cloud mode, inspect your bucket in the AWS S3 Console or use ListObjectsV2Command!",
      files: []
    });
  } else {
    res.json({
      mode: "OFFLINE_MOCK_S3",
      files: mockS3.listObjects()
    });
  }
});

/**
 * PUT /api/mock-s3-bucket/:key(*) — Simulated S3 endpoint to receive presigned browser uploads locally!
 */
app.put("/api/mock-s3-bucket/:key(*)", express.raw({ type: "*/*", limit: "50mb" }), (req, res) => {
  try {
    const key = req.params.key;
    const contentType = req.headers["content-type"] || "application/octet-stream";
    const bodyBuffer = req.body;

    // Verify presence of simulated security signature query parameters
    if (!req.query["X-Amz-Signature"]) {
      return res.status(403).json({ error: "AccessDenied: Missing X-Amz-Signature presigned credential." });
    }

    mockS3.putObject(key, bodyBuffer, contentType);
    
    // AWS S3 PUT returns 200 OK with ETag header on success
    res.set("ETag", `"mock-etag-${Date.now()}"`);
    res.status(200).send("");
  } catch (error) {
    console.error("Error in mock S3 putObject:", error);
    res.status(500).json({ error: "Internal Mock S3 Error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Lesson 42 S3 Upload API Server listening on http://localhost:${PORT}`);
});
