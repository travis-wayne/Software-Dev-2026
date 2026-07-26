# Lesson 42 — Cloud & Advanced Topics: Cloud Services (AWS S3, Lambda)
**Software-Dev-2026 Curriculum**

Welcome to **Lesson 42**! In this module, we transition from traditional server-bound backends to modern **Cloud Computing** and **Serverless Architecture** using **Amazon Web Services (AWS)**. You will master scalable object storage with **AWS S3 (Simple Storage Service)** and event-driven compute execution with **AWS Lambda** and **API Gateway**.

---

## 🎯 Learning Objectives

By the end of this session, you will be able to:
1. **Differentiate Cloud Service Models**: Understand the trade-offs between **IaaS** (Infrastructure as a Service), **PaaS** (Platform as a Service), and **SaaS** (Software as a Service), and why serverless architectures dominate modern web development.
2. **Master AWS S3 Object Storage**: Design scalable storage systems using S3 buckets, manage IAM least-privilege access control policies, configure CORS, and implement **Presigned URLs** for secure direct client-to-cloud file uploads without burdening backend server RAM.
3. **Build Serverless AWS Lambda Functions**: Write event-driven Node.js Lambda functions that execute in response to HTTP requests (via API Gateway) or asynchronous storage triggers (like S3 `ObjectCreated:Put` events).
4. **Optimize Serverless Performance & Costs**: Demystify **Cold Starts vs. Warm Starts**, memory allocation trade-offs, and cost management strategies within the AWS Free Tier.
5. **Develop Offline with Dual-Mode Cloud Adapters**: Build and test cloud applications locally using mock in-memory storage adapters and local API Gateway event simulators before deploying to production AWS infrastructure.

---

## 📂 Folder Structure

```
Lesson 42/
├── README.md                              # This module overview
├── notes/
│   ├── tutor_notes.md                     # Teaching guide, analogies, IAM gotchas & live console walkthroughs
│   └── student_notes.md                   # Comprehensive student reference on S3, Lambda, and Serverless concepts
├── exercises/
│   └── aws_cloud_practice.md              # 4 practical exercises covering IAM policies, Presigned URLs, and Lambda triggers
└── examples/
    ├── s3-upload-api/                     # Runnable Express API with @aws-sdk/client-s3 and offline Mock S3 adapter
    ├── lambda-serverless-demo/            # Runnable Node.js Lambda handler suite with local API Gateway simulator
    └── cloud-simulator-lab/
        └── index.html                     # 4-tab interactive dark glassmorphism lab (S3 upload & Lambda workbench)
```

---

## 🚀 Quickstart Guide

All demonstration projects in Lesson 42 are configured with **Dual-Mode Adapters**, meaning they work **instantly offline** out of the box without requiring an active AWS account, billing credit card, or IAM keys!

### 1. Test the AWS S3 Presigned URL & Upload API
Demonstrates generating cryptographic Presigned URLs and storing objects in S3 (or local memory):
```bash
cd examples/s3-upload-api
pnpm install
pnpm dev
```
* API Server running at: `http://localhost:3003`
* Check status and storage mode: `http://localhost:3003/api/status`

### 2. Test the AWS Lambda & API Gateway Simulator
Demonstrates event-driven Lambda execution, cold start simulation, and S3 event triggers:
```bash
cd ../lambda-serverless-demo
pnpm install
pnpm dev
```
* Lambda Runtime Simulator running at: `http://localhost:3004`
* Invoke Quote Lambda: `http://localhost:3004/api/quote`

### 3. Launch the Interactive Cloud Lab
Open `examples/cloud-simulator-lab/index.html` directly in any web browser to explore the **Cloud Architect Map**, test live **Presigned URL generation**, inspect raw **Lambda event payloads**, and take the **Mastery Quiz**!

---

## ☁️ Connecting to Real AWS Cloud Infrastructure

When you are ready to test against live Amazon Web Services:
1. Create an AWS account and generate an IAM User with `AmazonS3FullAccess` and `AWSLambda_FullAccess` permissions (or scoped custom policies).
2. Copy `.env.example` to `.env` in `examples/s3-upload-api/`:
   ```env
   AWS_REGION="us-east-1"
   AWS_ACCESS_KEY_ID="AKIA_YOUR_REAL_ACCESS_KEY"
   AWS_SECRET_ACCESS_KEY="YOUR_REAL_SECRET_KEY"
   AWS_S3_BUCKET="my-lesson42-demo-bucket"
   ```
3. Restart the server with `pnpm dev`. It will automatically detect your credentials and switch from Offline Mock Mode to Live AWS Cloud Mode!
