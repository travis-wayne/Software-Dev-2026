// lib/withApiKey.js — API Key Authentication Middleware Wrapper
export function withApiKey(handler) {
  return async (req, res) => {
    const apiKey = req.headers['x-api-key'] || req.headers.authorization?.replace('Bearer ', '');
    const secretKey = process.env.API_SECRET_KEY || 'secret_key_2026';

    if (!apiKey || apiKey !== secretKey) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized access. Valid X-API-Key header required.',
        hint: 'Default test key is: secret_key_2026'
      });
    }

    return handler(req, res);
  };
}
