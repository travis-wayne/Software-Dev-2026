import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.GATEWAY_PORT || 3009;

app.use(cors());
app.use(express.json());

const services = {
  user: {
    url: process.env.USER_SERVICE_URL || 'http://localhost:3010',
    cb: { state: 'CLOSED', failures: 0, lastFailure: null, threshold: 3, timeout: 15000 }
  },
  product: {
    url: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3011',
    cb: { state: 'CLOSED', failures: 0, lastFailure: null, threshold: 3, timeout: 15000 }
  },
  order: {
    url: process.env.ORDER_SERVICE_URL || 'http://localhost:3012',
    cb: { state: 'CLOSED', failures: 0, lastFailure: null, threshold: 3, timeout: 15000 }
  }
};

// Rate limiting state
const rateLimits = {};
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW = 60000;

app.use((req, res, next) => {
  const ip = req.ip || '127.0.0.1';
  const now = Date.now();
  
  if (!rateLimits[ip]) {
    rateLimits[ip] = { count: 1, resetAt: now + RATE_LIMIT_WINDOW };
  } else {
    if (now > rateLimits[ip].resetAt) {
      rateLimits[ip] = { count: 1, resetAt: now + RATE_LIMIT_WINDOW };
    } else {
      rateLimits[ip].count++;
      if (rateLimits[ip].count > RATE_LIMIT_MAX) {
        return res.status(429).json({ error: 'Too Many Requests' });
      }
    }
  }
  next();
});

const proxyRequest = async (serviceName, path, req, res) => {
  const service = services[serviceName];
  if (!service) return res.status(404).json({ error: 'Service not found' });

  const cb = service.cb;
  
  if (cb.state === 'OPEN') {
    if (Date.now() - cb.lastFailure > cb.timeout) {
      cb.state = 'HALF_OPEN';
      console.log(`[Circuit Breaker] ${serviceName} changed to HALF_OPEN. Testing...`);
    } else {
      return res.status(503).json({ 
        error: 'Service Unavailable', 
        message: 'Circuit breaker is OPEN. Fast failing.',
        service: serviceName
      });
    }
  }

  const targetUrl = `${service.url}${path}`;
  const requestId = crypto.randomUUID();
  
  try {
    const headers = { ...req.headers };
    delete headers.host; // prevent issues
    headers['X-Gateway-Request-Id'] = requestId;
    headers['X-Gateway-Version'] = '1.0.0';
    
    const fetchOptions = {
      method: req.method,
      headers
    };
    
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body);
    }
    
    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();
    
    if (response.ok) {
      if (cb.state === 'HALF_OPEN' || cb.state === 'OPEN') {
         cb.state = 'CLOSED';
         cb.failures = 0;
         console.log(`[Circuit Breaker] ${serviceName} changed to CLOSED.`);
      } else {
         cb.failures = 0;
      }
      return res.status(response.status).set({
        'X-Gateway-Request-Id': requestId,
        'X-Gateway-Version': '1.0.0'
      }).json(data);
    } else {
      throw new Error(`Service responded with ${response.status}`);
    }
  } catch (error) {
    cb.failures++;
    cb.lastFailure = Date.now();
    console.error(`[Gateway Error] ${serviceName} request failed:`, error.message);
    
    if (cb.state === 'HALF_OPEN' || cb.failures >= cb.threshold) {
      cb.state = 'OPEN';
      console.log(`[Circuit Breaker] ${serviceName} TRIPPED! State is now OPEN.`);
    }
    
    return res.status(502).json({ error: 'Bad Gateway', message: error.message });
  }
};

app.get('/api/health', (req, res) => {
  res.json({
    gateway: 'healthy',
    services: Object.keys(services).map(name => ({
      name,
      url: services[name].url,
      circuitBreaker: services[name].cb
    }))
  });
});

app.get('/api/services', (req, res) => {
  res.json(services);
});

// Routing
app.use('/api/users', (req, res) => proxyRequest('user', req.originalUrl.replace('/api/users', '/users'), req, res));
app.use('/api/products', (req, res) => proxyRequest('product', req.originalUrl.replace('/api/products', '/products'), req, res));
app.use('/api/orders', (req, res) => proxyRequest('order', req.originalUrl.replace('/api/orders', '/orders'), req, res));

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log('Configured Services:');
  Object.keys(services).forEach(s => console.log(` - ${s}: ${services[s].url}`));
});
