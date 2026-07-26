// server.js — Local API Gateway & AWS Lambda Runtime Simulator
// Wraps standalone serverless handler functions in an Express test server to simulate AWS cloud execution!

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import { handler as quoteHandler } from "./handlers/quoteHandler.js";
import { handler as imageMetadataHandler } from "./handlers/imageMetadataHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;
const SIMULATE_COLD_STARTS = process.env.SIMULATE_COLD_STARTS !== "false";

app.use(cors());
app.use(express.json());

// Container State Tracking for Cold Start vs Warm Start Simulation
const containerState = {
  quoteHandler: { isWarm: false, lastAccessed: 0, invocationCount: 0 },
  imageMetadataHandler: { isWarm: false, lastAccessed: 0, invocationCount: 0 }
};

/**
 * Simulates container boot latency if the Lambda function hasn't run recently
 */
async function simulateLambdaRuntime(functionName) {
  const state = containerState[functionName];
  const now = Date.now();

  // If container hasn't been invoked in 30 seconds, it powers down and goes cold
  if (now - state.lastAccessed > 30000) {
    state.isWarm = false;
  }

  const isColdStart = !state.isWarm;
  state.invocationCount++;
  state.lastAccessed = now;
  state.isWarm = true;

  if (isColdStart && SIMULATE_COLD_STARTS) {
    console.log(`❄️ [Cold Start Detected for ${functionName}] Simulating micro-container provisioning (1000ms)...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  } else {
    console.log(`🔥 [Warm Start for ${functionName}] Reusing existing micro-container!`);
  }

  return {
    awsRequestId: `req-${crypto.randomBytes(6).toString("hex")}`,
    functionName: functionName,
    memoryLimitInMB: "128",
    isColdStart: isColdStart,
    invocationCount: state.invocationCount
  };
}

/**
 * GET /api/status — Check simulator status and warm/cold container states
 */
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    simulator: "AWS Lambda & API Gateway Local Runtime",
    coldStartSimulationEnabled: SIMULATE_COLD_STARTS,
    containers: containerState,
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/quote — Simulates an API Gateway HTTP GET Trigger calling quoteHandler
 */
app.get("/api/quote", async (req, res) => {
  try {
    const context = await simulateLambdaRuntime("quoteHandler");

    // Construct simulated API Gateway Event object
    const apiGatewayEvent = {
      httpMethod: "GET",
      path: "/api/quote",
      queryStringParameters: req.query || {},
      headers: req.headers,
      requestContext: {
        identity: { sourceIp: req.ip },
        requestId: context.awsRequestId
      }
    };

    // Invoke standalone Lambda handler
    const lambdaResponse = await quoteHandler(apiGatewayEvent, context);

    // Forward Lambda formatted response back to client
    res.status(lambdaResponse.statusCode || 200)
       .set(lambdaResponse.headers || {})
       .send(lambdaResponse.body);
  } catch (error) {
    console.error("Error executing quoteHandler Lambda:", error);
    res.status(502).json({ error: "502 Bad Gateway (Simulated Lambda Execution Failure)", details: error.message });
  }
});

/**
 * POST /api/simulate-s3-event — Simulates an AWS S3 Bucket ObjectCreated:Put Event calling imageMetadataHandler
 */
app.post("/api/simulate-s3-event", async (req, res) => {
  try {
    const { bucket, key, size } = req.body;
    const context = await simulateLambdaRuntime("imageMetadataHandler");

    // Construct simulated AWS S3 Bucket Event payload
    const s3EventPayload = {
      Records: [
        {
          eventVersion: "2.1",
          eventSource: "aws:s3",
          awsRegion: "us-east-1",
          eventTime: new Date().toISOString(),
          eventName: "ObjectCreated:Put",
          s3: {
            bucket: { name: bucket || "my-demo-shop-assets-2026" },
            object: {
              key: encodeURIComponent(key || "products/new-shirt-4k.webp"),
              size: size || 245760 // 240KB
            }
          }
        }
      ]
    };

    // Invoke standalone Lambda handler
    const lambdaResponse = await imageMetadataHandler(s3EventPayload, context);

    res.status(lambdaResponse.statusCode || 200)
       .set(lambdaResponse.headers || {})
       .send(lambdaResponse.body);
  } catch (error) {
    console.error("Error executing imageMetadataHandler Lambda:", error);
    res.status(500).json({ error: "Lambda Execution Error", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Lesson 42 Lambda Serverless Simulator listening on http://localhost:${PORT}`);
});
