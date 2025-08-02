const { verifyToken } = require("./jwt.util");

/**
 * Extracts the decoded payload from JWT token.
 * @param {Object} req - The Express request object.
 * @returns {Object|null} - The decoded token if valid, otherwise an error object.
 */
const extractTokenPayload = (req) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

  const decoded = verifyToken(token);
  return decoded; // Can be { status, message } or { user_id, role, iat, exp }
};

/**
 * Extracts user_id from token
 */
const extractUserId = (req) => {
  const decoded = extractTokenPayload(req);
  if (decoded.status) return decoded;
  return decoded.user_id;
};

/**
 * Extracts role from token
 */
const extractUserRole = (req) => {
  const decoded = extractTokenPayload(req);
  if (decoded.status) return decoded;
  return decoded.role;
};

module.exports = {
  extractUserId,
  extractUserRole,
  extractTokenPayload,
};
