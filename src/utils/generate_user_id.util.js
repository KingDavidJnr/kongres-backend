// Function to generate 10 digit User IDs as primary keys
function generateUserId() {
  // Generate a random 11-digit number
  const min = Math.pow(10, 9); // Minimum 10-digit number
  const max = Math.pow(10, 10) - 1; // Maximum 10-digit number
  return Math.floor(min + Math.random() * (max - min + 1));
}

module.exports = generateUserId;
