// imageMetadataHandler.js — Standalone AWS Lambda Handler (S3 ObjectCreated:Put Event Trigger)
// Simulates background event-driven processing when a user uploads a file to S3!

export const handler = async (event, context) => {
  console.log(`📦 [imageMetadataHandler] Asynchronous S3 Trigger received. Request ID: ${context.awsRequestId}`);

  const record = event.Records && event.Records[0];
  
  if (!record || !record.s3) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Invalid S3 Event payload: Missing record data." })
    };
  }

  const bucketName = record.s3.bucket.name;
  const fileKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
  const fileSizeInBytes = record.s3.object.size || 102400; // default 100KB if mock
  const eventTime = record.eventTime || new Date().toISOString();

  console.log(`🚀 Processing object '${fileKey}' (${fileSizeInBytes} bytes) in bucket '${bucketName}'...`);

  // Simulate image analysis or thumbnail generation metadata
  const fileExtension = fileKey.split('.').pop()?.toLowerCase() || "unknown";
  const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(fileExtension);

  const processingResult = {
    processedAt: new Date().toISOString(),
    eventTrigger: record.eventName || "ObjectCreated:Put",
    bucket: bucketName,
    fileKey: fileKey,
    fileSizeKb: Number((fileSizeInBytes / 1024).toFixed(2)),
    fileType: isImage ? `image/${fileExtension}` : `application/${fileExtension}`,
    simulatedActions: isImage 
      ? ["Generated 150x150 thumbnail", "Extracted EXIF metadata", "Indexed in DynamoDB catalog"]
      : ["Verified virus scan", "Archived to S3 Glacier storage tier"],
    status: "SUCCESS_ASYNCHRONOUS_PROCESSING"
  };

  console.log("✅ Asynchronous S3 event processing complete:", processingResult);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(processingResult)
  };
};
