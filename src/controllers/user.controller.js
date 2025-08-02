const UserService = require("../services/user.service");
const { hashPassword, comparePasswords } = require("../utils/bcrypt.util");
const { generateToken } = require("../utils/jwt.util");
const generateUserId = require("../utils/generate_user_id.util");

class UserController {
  // Create a new user
  async signUp(req, res) {
    try {
      const { email, password, first_name, last_name } = req.body;

      // Check for required fields
      if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if email is already taken
      const emailExists = await UserService.emailExists(email);
      if (emailExists) {
        return res.status(409).json({ message: "Email already in use" });
      }

      // Generate unique user_id (BigInt)
      let user_id;
      let userExists;
      do {
        user_id = generateUserId();
        userExists = await UserService.getUserById(user_id);
      } while (userExists);

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await UserService.createUser({
        user_id,
        email,
        password: hashedPassword,
        first_name,
        last_name,
      });

      // Generate JWT token
      const token = generateToken(user.user_id.toString());

      // Set cookie with token
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "None",
      });

      return res.status(201).json({
        message: "User created successfully",
        data: {
          user_id: user.user_id.toString(), // 🛠 Convert BigInt to string
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST /v1/auth/login
  async login(req, res) {
    // implementation pending
  }

  // PATCH /v1/user/profile
  async updateProfile(req, res) {
    // implementation pending
  }

  // GET /v1/user/profile
  async getProfile(req, res) {
    // implementation pending
  }

  // DELETE /v1/user/profile
  async deleteProfile(req, res) {
    // implementation pending
  }
}

module.exports = new UserController();
