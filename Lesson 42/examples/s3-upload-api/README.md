# Lesson 42 — AWS S3 Upload API & Presigned URL Demo
**Software-Dev-2026 Curriculum**

This demonstration project illustrates how backend Node.js APIs use `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` to generate cryptographic **Presigned URLs**. By handing signed URLs to frontend clients, browsers can upload large files directly to AWS S3 without passing through or consuming memory on the backend server!

## 🟢 Dual-Mode Offline Adapter
To make learning stress-free, this server automatically runs in **Offline Mock S3 Mode** out of the box if no AWS credentials are provided in `.env`. It stores uploaded files in local RAM and simulates presigned cryptographic validation.

---

## 🚀 Running the Project

```bash
# 1. Install dependencies strictly using pnpm
pnpm install

# 2. Start the local server
pnpm dev
```
The server will start on `http://localhost:3003`.

---

## 🧪 API Endpoints

### 1. Check Service Status
```bash
curl http://localhost:3003/api/status
```

### 2. Generate a Presigned Upload URL
```bash
curl -X POST http://localhost:3003/api/upload-url \
  -H "Content-Type: application/json" \
  -d '{"filename": "my-photo.jpg", "fileType": "image/jpeg"}'
```

### 3. Direct File Upload (Simulating Browser PUT Request)
Use the `uploadUrl` returned from step 2:
```bash
curl -X PUT "http://localhost:3003/api/mock-s3-bucket/uploads/12345-my-photo.jpg?X-Amz-Algorithm=..." \
  -H "Content-Type: image/jpeg" \
  --data-binary "@test-image.jpg"
```
