# Student Notes — Session 42: Cloud Services (AWS S3 & Lambda)
**Comprehensive Reference Guide: Cloud Computing, Object Storage, and Serverless Architecture**

---

### Quick Start Paths
- **Path A (Recommended):** Supabase Storage — Zero credit card, 5GB free, live cloud bucket in 2 minutes
- **Path B:** AWS S3 Free Tier — Real enterprise storage but requires credit card for signup
- **Path C:** Local Offline Mock — No internet required, mockS3.js simulator

*Students can follow ANY path and still learn the same concepts.*

## 1. Introduction to Cloud Computing

In traditional web development, deploying an application required buying physical computer hardware, installing a Linux operating system, connecting networking cables, and keeping the server running in a temperature-controlled room 24 hours a day, 7 days a week. If your web application suddenly went viral and received a million visitors overnight, your physical server would run out of RAM and crash. Expanding required ordering more hardware and waiting weeks for shipping.

**Cloud Computing** is the on-demand delivery of IT resources and computing power over the internet with pay-as-you-go pricing. Instead of buying, owning, and maintaining physical servers, you rent access to storage, databases, and computing power from a cloud provider like **Amazon Web Services (AWS)**, Google Cloud Platform (GCP), or Microsoft Azure.

### Key Advantages of the Cloud:
* **Elastic Scalability**: Instantly scale up to handle 10,000 concurrent users in seconds, and scale back down to zero when traffic stops.
* **Cost Efficiency (Pay-As-You-Go)**: You never pay for idle hardware. You pay only for the exact gigabytes of data stored or the exact milliseconds of compute time consumed.
* **High Availability & Reliability**: Cloud providers distribute your data across multiple physical data centers (called Availability Zones) around the globe, ensuring your app stays online even if an entire power grid fails.

---

## 2. The Cloud Service Spectrum: IaaS vs. PaaS vs. SaaS vs. FaaS

Cloud services are categorized into distinct abstraction layers depending on how much infrastructure you want to manage versus how much you want the cloud provider to manage for you:

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           THE CLOUD SERVICE SPECTRUM                              │
├──────────────────┬──────────────────┬──────────────────┬──────────────────────────┤
│ Traditional      │ IaaS             │ PaaS             │ FaaS (Serverless)        │
│ On-Premise       │ (EC2, VPC)       │ (Heroku, Vercel) │ (AWS Lambda)             │
├──────────────────┼──────────────────┼──────────────────┼──────────────────────────┤
│ ❌ Applications  │ ❌ Applications  │ ❌ Applications  │ ❌ Applications (Code)   │
│ ❌ Data          │ ❌ Data          │ ❌ Data          │ ☁️ AWS Manages Scaling   │
│ ❌ Runtime       │ ❌ Runtime       │ ☁️ AWS Manages   │ ☁️ AWS Manages Runtime   │
│ ❌ OS / Linux    │ ❌ OS / Linux    │ ☁️ AWS Manages   │ ☁️ AWS Manages OS        │
│ ❌ Virtualization│ ☁️ AWS Manages   │ ☁️ AWS Manages   │ ☁️ AWS Manages Hardware  │
│ ❌ Servers / RAM │ ☁️ AWS Manages   │ ☁️ AWS Manages   │ ☁️ AWS Manages Servers   │
│ ❌ Networking    │ ☁️ AWS Manages   │ ☁️ AWS Manages   │ ☁️ AWS Manages Network   │
└──────────────────┴──────────────────┴──────────────────┴──────────────────────────┘
  (❌ = You Manage, ☁️ = Cloud Provider Manages)
```

1. **IaaS (Infrastructure as a Service)**: You rent raw virtual machines (e.g., **AWS EC2**). You must install the operating system, configure SSH keys, manage firewall rules, and install Node.js yourself. Maximum control, highest maintenance.
2. **PaaS (Platform as a Service)**: You upload your application code, and the provider handles the underlying servers, operating systems, and load balancing (e.g., **Heroku**, **Elastic Beanstalk**, **Vercel**).
3. **SaaS (Software as a Service)**: Fully functional end-user software delivered over the web (e.g., **Google Workspace**, **GitHub**, **Stripe**).
4. **FaaS (Function as a Service / Serverless)**: You write standalone modular functions (e.g., **AWS Lambda**). You don't even manage a long-running Node.js process. The cloud executes your function when triggered by an event and shuts it down immediately after.

---

## 3. AWS S3 (Simple Storage Service): Scalable Object Storage

### Why Not Store Images in PostgreSQL or MongoDB?
A common mistake made by beginner developers is storing uploaded user profile pictures or product videos directly inside a database column (using binary `BLOB` or `Buffer` data types). This is an anti-pattern because:
* It causes your database backups to bloat to hundreds of gigabytes.
* Database RAM is expensive; serving static media from database memory starves your relational queries of RAM.
* Relational databases cannot easily stream large files or utilize Content Delivery Network (CDN) edge caching.

### How S3 Works: Buckets, Objects, and Keys
**AWS S3** is an infinite, highly durable object storage system designed for static assets (images, videos, PDFs, backups, CSS/JS bundles).
* **Bucket**: The top-level container for your files (equivalent to a root hard drive or folder). **Bucket names must be globally unique across all AWS accounts worldwide!**
* **Object**: The actual file data stored inside the bucket, along with custom metadata tags (e.g., `ContentType: image/png`).
* **Key**: The unique file path and name identifying the object inside the bucket (e.g., `users/avatars/alice-99.jpg`).
* **ARN (Amazon Resource Name)**: The universal AWS address identifying your bucket: `arn:aws:s3:::my-app-assets-2026/users/avatars/*`.

---

## 4B. Supabase Storage — S3-Compatible Cloud Buckets with Zero Setup

What Supabase Storage is: built on top of S3 under the hood, but with a friendly dashboard and JS SDK.

**Setup steps:**
1. Go to supabase.com → New project
2. Go to Storage in sidebar → Create new bucket (name: 'lesson-42-uploads', set to Public for dev)
3. Go to Project Settings → API → copy SUPABASE_URL and SUPABASE_ANON_KEY
4. Set in .env: `SUPABASE_URL=...` `SUPABASE_ANON_KEY=...`

**JavaScript SDK upload pattern:**
```javascript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const { data, error } = await supabase.storage
  .from('lesson-42-uploads')
  .upload(`files/${Date.now()}-${filename}`, fileBuffer, { contentType: mimeType });
```

**How to get the public URL:** `supabase.storage.from('lesson-42-uploads').getPublicUrl(data.path)`

**Row Level Security (RLS) policies:** RLS policies allow you to write rules using PostgreSQL to control exactly who can read, upload, update, or delete files in your buckets. They are critical in production to ensure users can only modify their own files.

**Comparison table: Supabase Storage vs AWS S3**
| Feature | Supabase Storage | AWS S3 |
|---------|-----------------|--------|
| Credit card required | No | Yes |
| Free storage | 5GB | 5GB (12 months) |
| SDK complexity | Simple (20 lines) | Complex (presigned URLs, IAM) |
| Dashboard | Excellent GUI | Complex console |
| Use in production | Yes (up to enterprise) | Yes (industry standard) |
| S3 compatible API | Yes | Native |

---

## 5. Security & Least Privilege: AWS IAM Architecture

To interact with AWS services securely from Node.js, you never use your root account credentials. Instead, you use **AWS IAM (Identity and Access Management)** to create granular access rules.

### The Core IAM Concept: The Principle of Least Privilege
Always grant code the **minimum possible permissions** required to perform its job. If your backend API only needs to upload profile pictures to S3, do not grant it permission to delete databases or launch EC2 servers!

#### Example Least-Privilege IAM JSON Policy for S3 Uploads:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::my-app-assets-2026/uploads/*"
    }
  ]
}
```

---

## 5. The Presigned URL Architecture: Direct-to-Cloud Uploads

When a user uploads a 100MB video file to your web app, sending that file through your Node.js backend server will exhaust server RAM and double your bandwidth billing.

The industry standard architecture uses **S3 Presigned URLs**. Your backend generates a temporary cryptographic URL that gives the client's browser permission to upload the file **directly to AWS S3**, bypassing your server entirely!

```
┌──────────────┐          1. Request Presigned URL         ┌────────────────────┐
│   Browser    │ ────────────────────────────────────────> │ Node.js Express API│
│ (Client UI)  │ <──────────────────────────────────────── │  (AWS SDK v3 S3)   │
└──────┬───────┘   2. Returns Signed URL (valid 15 min)    └────────────────────┘
       │                                                              
       │ 3. Direct HTTP PUT Upload (100MB Video File)                 
       ▼                                                              
┌────────────────────────────────────────────────────────┐            
│                  AWS S3 Cloud Bucket                   │            
└────────────────────────────────────────────────────────┘            
```

### Implementing Presigned URLs in Node.js (AWS SDK v3):
```javascript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: "us-east-1" });

async function generateUploadUrl(filename, fileType) {
  const command = new PutObjectCommand({
    Bucket: "my-app-assets-2026",
    Key: `uploads/${Date.now()}-${filename}`,
    ContentType: fileType,
  });

  // Generate a secure URL signed with our IAM secret, expiring in 900 seconds (15 mins)
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
  return signedUrl;
}
```

---

## 6. AWS Lambda & Serverless Event-Driven Compute

**AWS Lambda** is a serverless computing service that runs your code in response to events and automatically manages the compute resources required.

### Anatomy of an AWS Lambda Handler Function
Every Node.js Lambda function exports a `handler` method that receives two arguments: `event` and `context`.

```javascript
export const handler = async (event, context) => {
  console.log("Execution Context ID:", context.awsRequestId);
  console.log("Raw Trigger Event:", JSON.stringify(event, null, 2));

  // Extract query parameters or HTTP body sent by API Gateway
  const name = event.queryStringParameters?.name || "World";

  // Lambda must return a formatted HTTP response object when connected to API Gateway!
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*" // Required for browser CORS!
    },
    body: JSON.stringify({
      success: true,
      message: `Hello ${name} from AWS Lambda serverless execution!`,
      timestamp: new Date().toISOString()
    })
  };
};
```

### Cold Starts vs. Warm Starts
When an AWS Lambda function has not been triggered for 15–30 minutes, AWS powers down its micro-container to save electricity and money.
* **Cold Start**: When a new request arrives, AWS must allocate a new micro-virtual machine, download your code zip file, initialize the Node.js runtime, and execute your handler. This initial boot takes **1 to 2 seconds**.
* **Warm Start**: If another request arrives while the container is still alive in memory, AWS reuses the container instantly. Execution takes **10 to 50 milliseconds**!

---

## 7. Connecting Lambda to API Gateway & S3 Triggers

By itself, an AWS Lambda function cannot be reached from a web browser because it has no public IP address or domain name. We use event sources to trigger it:

### 1. API Gateway (HTTP REST Endpoint)
AWS API Gateway sits in front of Lambda, converting incoming HTTP `GET`, `POST`, and `DELETE` requests from browsers into structured JSON `event` objects and forwarding them to Lambda.

### 2. S3 Bucket Events (Asynchronous Processing)
You can configure an S3 bucket to trigger a Lambda function automatically whenever an event like `s3:ObjectCreated:Put` occurs.
* **Real-World Example**: A user uploads a high-resolution 10MB photo to your S3 bucket. S3 instantly fires an event to your image-resizing Lambda function. The Lambda downloads the 10MB photo, compresses it into a 50KB thumbnail using sharp/jimp, and saves the thumbnail back to a `/thumbnails` folder in S3! This happens asynchronously in the background without slowing down your user interface!

---

## 8. War Story: The Day Our Lambda Function Ran Out of Concurrent Executions
A startup had a Lambda that resized images on upload. During a product launch, 10,000 users uploaded profile photos simultaneously. AWS Lambda hit the default 1,000 concurrent execution limit in the region. Every upload after that returned 429 Too Many Requests. The CDN didn't cache the error, so the same image upload requests kept hammering Lambda. 
**Fix:** increase concurrent execution limit via AWS Support, implement exponential backoff retry on the client, and offload image resizing to an async SQS queue instead of synchronous API Gateway triggers.
