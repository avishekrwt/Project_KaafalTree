const adminAuth = (req, res, next) => {
  if (!req.admin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (!['admin', 'superadmin'].includes(req.admin.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  next();
};

module.exports = adminAuth;
