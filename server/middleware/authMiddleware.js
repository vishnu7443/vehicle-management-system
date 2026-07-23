const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. Authorization token missing.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Malformed token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vms_super_secret_jwt_key_2026');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized access.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden. Requires ${roles.join(' or ')} role.` });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole
};
