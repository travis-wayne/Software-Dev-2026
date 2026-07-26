// mockS3.js — Offline Mock S3 Bucket Adapter for Zero-Setup Local Development
// Simulates @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner without needing an active AWS account!

import crypto from "crypto";

class MockS3Service {
  constructor() {
    this.bucketName = "offline-mock-s3-bucket";
    this.objects = new Map(); // Store uploaded objects in memory: key -> { content, metadata }
  }

  /**
   * Generates a simulated S3 Presigned PUT URL pointing to our local Express server
   */
  async generatePresignedUrl(key, contentType, expiresInSeconds = 900, hostUrl = "http://localhost:3003") {
    const signature = crypto.randomBytes(16).toString("hex");
    const timestamp = Date.now();
    const expiresAt = timestamp + expiresInSeconds * 1000;

    // Simulated AWS Presigned URL format with query authentication parameters
    const encodedKey = encodeURIComponent(key);
    const presignedUrl = `${hostUrl}/api/mock-s3-bucket/${encodedKey}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=MOCK_KEY%2F20260726%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=${new Date().toISOString()}&X-Amz-Expires=${expiresInSeconds}&X-Amz-Signature=${signature}`;

    return {
      uploadUrl: presignedUrl,
      key: key,
      bucket: this.bucketName,
      expiresAt: new Date(expiresAt).toISOString(),
      mode: "OFFLINE_MOCK_S3"
    };
  }

  /**
   * Simulates PUT object storage from a browser presigned upload
   */
  putObject(key, bufferData, contentType) {
    this.objects.set(key, {
      key,
      size: bufferData ? bufferData.length : 0,
      contentType: contentType || "application/octet-stream",
      uploadedAt: new Date().toISOString(),
      url: `http://localhost:3003/api/mock-s3-bucket/${encodeURIComponent(key)}`
    });
    console.log(`[MockS3] Stored object '${key}' (${bufferData ? bufferData.length : 0} bytes) in memory bucket.`);
    return { status: 200, message: "OK" };
  }

  /**
   * Lists all stored objects in the mock bucket
   */
  listObjects() {
    return Array.from(this.objects.values()).reverse();
  }
}

export const mockS3 = new MockS3Service();
