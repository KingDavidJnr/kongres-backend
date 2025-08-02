const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const rounds = parseInt(process.env.SALT_ROUND, 10);

// The function to hash password
const hashPassword = async (plainPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, rounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password", error);
    throw new error("Error hashing plain password");
  }
};

//The function to compare hashed passwords with plain passwords
const comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    console.error("Error comparing passwords", error);
    throw new error("Error comparing passwords");
  }
};

// Exporting the functions as resuable modules
module.exports = {
  hashPassword,
  comparePasswords,
};