// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // --- FIX APPLIED HERE ---
    // Use 'decoded.userId' to match how the token was created
    const user = await User.findById(decoded.userId).select('-password');
    // -------------------------

    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token verification failed', error: err.message });
  }
};

// admin middleware remains the same, it is correct.
exports.admin = (req, res, next) => {
  console.log('req', req);
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access only' });
};