// quoteHandler.js — Standalone AWS Lambda Handler (API Gateway HTTP Trigger)
// Notice this function does NOT import Express or start a server! It receives an event & context from AWS.

const QUOTES = {
  tech: [
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" }
  ],
  cloud: [
    { text: "There is no cloud, it's just someone else's computer... managed with incredible automated orchestration!", author: "Cloud Proverb" },
    { text: "Serverless doesn't mean no servers; it means you don't spend your life patching Linux operating systems.", author: "AWS Architect" }
  ],
  general: [
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" }
  ]
};

export const handler = async (event, context) => {
  const startTime = Date.now();
  console.log(`⚡ [quoteHandler] Invoked with Request ID: ${context.awsRequestId}`);

  // Extract query string parameter ?category=tech from API Gateway event object
  const category = event.queryStringParameters?.category || "general";
  const quotesList = QUOTES[category] || QUOTES["general"];

  const randomIndex = Math.floor(Math.random() * quotesList.length);
  const selectedQuote = quotesList[randomIndex];

  const durationMs = Date.now() - startTime;

  // AWS API Gateway strictly requires this return object format!
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "X-Lambda-Execution-Time-Ms": String(durationMs)
    },
    body: JSON.stringify({
      success: true,
      category: category,
      quote: selectedQuote,
      serverlessMeta: {
        requestId: context.awsRequestId,
        functionName: context.functionName || "quoteHandler",
        memoryLimitInMB: context.memoryLimitInMB || "128",
        coldStart: context.isColdStart || false,
        durationMs: durationMs
      }
    })
  };
};
