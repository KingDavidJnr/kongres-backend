const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secret_key = process.env.JWT_SECRET;
const token_expiry = process.env.TOKEN_EXPIRY;

// Function to generate JWT token
const generateToken = (user_id) => {
  const payload = { user_id};
  const secret = secret_key;
  const options = { expiresIn: token_expiry };

  return jwt.sign(payload, secret, options);
};

const verifyToken = (token) => {
  const secret = secret_key;

  // Check if token exists
  if (!token) {
    return { status: 401, message: "No token provided." };
  }

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return {
        status: 401,
        message: "Your JWT token has expired. Kindly log out and log in again.",
      };
    } else if (error.name === "JsonWebTokenError") {
      return {
        status: 401,
        message: "Invalid token. Please provide a valid token.",
      };
    }

    return { status: 500, message: "There was an error decoding the token." };
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
