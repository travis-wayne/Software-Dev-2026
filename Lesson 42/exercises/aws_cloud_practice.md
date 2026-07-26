# Lesson 42 — Practice Exercises
**Cloud & Advanced Topics: Cloud Services (AWS S3 & Lambda)**

---

## Instructions for Students
In this practice set, you will master cloud access security, object storage workflows, and serverless compute execution. Work through the exercises below to solidify your understanding of AWS S3, IAM policies, Presigned URLs, and AWS Lambda event handlers!

---

### Exercise 1: Designing Least-Privilege IAM Policies
**Task:** You are tasked with securing an e-commerce platform's AWS S3 bucket named `acme-shop-assets-2026`. Your product catalog API needs permission to upload new product images and view existing images inside the `/products/` directory. However, to prevent accidental data loss, the API must NEVER be allowed to delete any images!

Write an AWS IAM JSON Policy document that enforces this strict least-privilege security model.

#### 💡 Exercise 1 Solution
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowProductCatalogReadWriteOnly",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::acme-shop-assets-2026/products/*"
    }
  ]
}
```
*Note: By omitting `"s3:DeleteObject"` and scoping the `"Resource"` specifically to `/products/*`, any attempt by compromised API keys to delete files or read sensitive customer invoices stored in other folders will be rejected by AWS with an `AccessDenied` error!*

---

### Exercise 2: Writing a Serverless API Gateway Lambda Handler
**Task:** Write an AWS Lambda handler function `quoteHandler.js` that acts as a serverless API endpoint connected to an AWS API Gateway HTTP trigger. The handler should:
1. Accept an optional query string parameter `?category=tech` (defaulting to `"general"` if missing).
2. Return a random quote matching the selected category.
3. Include required API Gateway HTTP status code (`200`) and Cross-Origin Resource Sharing (`CORS`) headers so browser frontends can call it without security blocks.
4. Properly stringify the JSON response body!

#### 💡 Exercise 2 Solution
```javascript
// quoteHandler.js — AWS Lambda Serverless API Endpoint

const QUOTE_DATABASE = {
  tech: [
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" }
  ],
  general: [
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" }
  ]
};

export const handler = async (event, context) => {
  console.log("⚡ Lambda Execution ID:", context.awsRequestId);
  
  // 1. Extract query string parameter safely from API Gateway event
  const category = event.queryStringParameters?.category || "general";
  const quotesList = QUOTE_DATABASE[category] || QUOTE_DATABASE["general"];
  
  // 2. Select random quote
  const randomIndex = Math.floor(Math.random() * quotesList.length);
  const selectedQuote = quotesList[randomIndex];

  // 3 & 4. Return properly formatted API Gateway response object with CORS!
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Cache-Control": "max-age=60" // Tell browser to cache warm responses for 60 seconds
    },
    body: JSON.stringify({
      success: true,
      category: category,
      data: selectedQuote,
      executionMeta: {
        requestId: context.awsRequestId,
        runtime: "Node.js 20.x Serverless"
      }
    })
  };
};
```

---

### Exercise 3: Building an S3 Event-Triggered Lambda Handler
**Task:** You want to automatically process files whenever a user uploads a new image to your AWS S3 bucket. Write an asynchronous AWS Lambda function `imageMetadataHandler.js` triggered by an S3 `ObjectCreated:Put` event.
Your function must parse the incoming AWS event object, extract the S3 bucket name and the uploaded file key, log a processing confirmation, and return a summary object.

#### 💡 Exercise 3 Solution
```javascript
// imageMetadataHandler.js — Triggered asynchronously by AWS S3 Bucket Events

export const handler = async (event, context) => {
  console.log("📦 Received S3 Event Trigger:", JSON.stringify(event));

  // S3 events can batch multiple file records in a single array
  const record = event.Records && event.Records[0];
  
  if (!record || !record.s3) {
    throw new Error("Invalid event payload: Missing S3 record data.");
  }

  // Extract bucket name and URL-decoded file key
  const bucketName = record.s3.bucket.name;
  const fileKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
  const fileSizeInBytes = record.s3.object.size;

  console.log(`🚀 Processing new upload in bucket '${bucketName}': ${fileKey} (${fileSizeInBytes} bytes)`);

  // In a real production app, you would use AWS SDK here to call image compression libraries!
  const processingResult = {
    processedAt: new Date().toISOString(),
    bucket: bucketName,
    file: fileKey,
    sizeKb: Number((fileSizeInBytes / 1024).toFixed(2)),
    status: "METADATA_LOGGED_SUCCESSFULLY"
  };

  console.log("✅ Processing complete:", processingResult);
  return processingResult;
};
```

---

### Exercise 4: Generating S3 Presigned URLs for Direct Uploads
**Task:** To prevent high-traffic video uploads from crashing your Node.js backend server, write a utility function `createAvatarUploadUrl(userId, fileType)` using `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`.
The function should generate a cryptographic Presigned URL that allows a user's browser to perform a direct HTTP `PUT` upload into an S3 bucket named `user-avatars-prod`, expiring after exactly 5 minutes (300 seconds).

#### 💡 Exercise 4 Solution
```javascript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client (inherits region and credentials from environment variables)
const s3Client = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });

export async function createAvatarUploadUrl(userId, fileType) {
  const fileExtension = fileType.split('/')[1] || "png";
  const uniqueKey = `avatars/user-${userId}-${Date.now()}.${fileExtension}`;

  const putCommand = new PutObjectCommand({
    Bucket: "user-avatars-prod",
    Key: uniqueKey,
    ContentType: fileType
  });

  // Generate cryptographic signature valid for exactly 300 seconds (5 mins)
  const presignedUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 300 });

  return {
    uploadUrl: presignedUrl,
    fileKey: uniqueKey,
    expiresInSeconds: 300,
    instructions: "Send a direct HTTP PUT request to uploadUrl with your raw file blob as the body!"
  };
}
```

---

### Exercise 5: The Serverless Debugging Challenge
**Task:** Below is a buggy Lambda function written by a junior developer attempting to return user profile data via API Gateway. When deployed, browser frontends report CORS blocks and 502 Internal Server Errors! 
Identify the **3 critical serverless bugs** in the snippet below and write the corrected version.

#### ❌ The Buggy Snippet:
```javascript
export const handler = async (event) => {
  const userProfile = { id: 101, name: "Alice", role: "admin" };
  
  // Bug 1? Bug 2? Bug 3?
  return {
    status: 200,
    body: userProfile
  };
};
```

#### 💡 Exercise 5 Solution
**Why it is broken:**
1. **Bug 1 (`status` instead of `statusCode`)**: AWS API Gateway strictly expects the property name `statusCode`. Using `status` causes API Gateway to fail parsing and throw a **502 Bad Gateway** error!
2. **Bug 2 (Un-stringified JSON Object in `body`)**: API Gateway requires the `body` property to be a plain **string** (e.g., `JSON.stringify(...)`). Passing a raw JavaScript object crashes the integration.
3. **Bug 3 (Missing CORS Headers)**: Without `Access-Control-Allow-Origin: *`, web browsers will reject the API response when called from a frontend domain!

**Optimized & Corrected Solution:**
```javascript
export const handler = async (event) => {
  const userProfile = { id: 101, name: "Alice", role: "admin" };
  
  return {
    statusCode: 200, // Correct property name!
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*" // Required for CORS!
    },
    body: JSON.stringify(userProfile) // Properly stringified payload!
  };
};
```
