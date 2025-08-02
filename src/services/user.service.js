const prisma = require('../lib/prisma');
const bcrypt = require("bcrypt");

class UserService {
  // Create a new user
  async createUser({ email, password, first_name, last_name, user_id }) {
    return await prisma.user.create({
      data: {
        email,
        password, // Already hashed by controller
        first_name,
        last_name,
        user_id
      },
    });
  }

  // Update profile (first name, last name, email)
  async updateUserProfile(user_id, { first_name, last_name, email }) {
    return await prisma.user.update({
      where: { user_id },
      data: {
        first_name,
        last_name,
        email,
      },
    });
  }

  // Delete user and cascade their associated records
  async deleteUser(user_id) {
    return await prisma.user.delete({
      where: { user_id },
    });
  }

  // Fetch user by ID (optional utility)
  async getUserById(user_id) {
    return await prisma.user.findUnique({
      where: { user_id },
    });
  }

  // Checks if an email exists
  async emailExists(email, excludeUserId = null) {
    const whereClause = excludeUserId
      ? {
          email,
          NOT: { user_id: excludeUserId },
        }
      : { email };

    const user = await prisma.user.findFirst({ where: whereClause });
    return !!user; // Returns true if email exists, false otherwise
  }
}

module.exports = new UserService();
