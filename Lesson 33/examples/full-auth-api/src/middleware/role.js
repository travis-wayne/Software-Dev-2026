/**
 * Middleware to restrict access to ADMIN users only.
 * MUST be placed after requireAuth in the route chain,
 * because it relies on req.user existing.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(500).json({ error: 'Server configuration error: requireAdmin must follow requireAuth' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }

  next();
};
