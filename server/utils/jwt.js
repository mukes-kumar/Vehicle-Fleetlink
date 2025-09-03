// utils/jwt.js
const jwt = require('jsonwebtoken');
function generateToken(user) { // pass user doc
  return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
module.exports = generateToken;
