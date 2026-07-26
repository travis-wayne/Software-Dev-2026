import jwt from 'jsonwebtoken';

/**
 * protect — Verifies the JWT in the Authorization header.
 * Attach this middleware to any route that requires a logged-in user.
 * On success, attaches the decoded token payload to `req.user`.
 *
 * Usage:
 *   router.get('/profile', protect, getProfile);
 */
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authorized — no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // e.g. { id: '...', role: 'admin', iat: ..., exp: ... }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Not authorized — token is invalid or expired' });
  }
};

/**
 * adminOnly — Role-based access control guard.
 * Must be used AFTER the `protect` middleware (which sets req.user).
 * Rejects the request with 403 Forbidden if the user is not an admin.
 *
 * Usage:
 *   router.post('/products', protect, adminOnly, createProduct);
 */
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden — admin access required' });
  }
  next();
};
