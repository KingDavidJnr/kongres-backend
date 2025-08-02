const UserService = require("../services/user.service");
const { hashPassword, comparePasswords } = require("../utils/bcrypt.util");
const { generateToken } = require("../utils/jwt.util");
const generateUserId = require("../utils/generate_user_id.util");
const { extractUserId } = require("../utils/auth.util");

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

  // User logs in
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Check for required fields
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      // Find user by email
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Compare password
      const isMatch = await comparePasswords(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT
      const token = generateToken(user.user_id.toString());

      // Set cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "None",
      });

      // Send response
      return res.status(200).json({
        message: "Login successful",
        data: {
          user_id: user.user_id.toString(),
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update user details
  async updateProfile(req, res) {
    try {
      const { first_name, last_name, email } = req.body;

      // Ensure at least one field is being updated
      if (!first_name && !last_name && !email) {
        return res
          .status(400)
          .json({ message: "At least one field is required to update" });
      }

      // Extract user_id from token/cookie
      const user_id = extractUserId(req);
      if (!user_id) {
        return res.status(403).json({ message: "User not authenticated!" });
      }

      // If email is being updated, check for duplicates
      if (email) {
        const existingUser = await UserService.getUserByEmail(email);

        if (
          existingUser &&
          existingUser.user_id.toString() !== user_id.toString()
        ) {
          return res
            .status(409)
            .json({ message: "Email is already in use by another account" });
        }
      }

      // Build update payload
      const updateData = {};
      if (first_name) updateData.first_name = first_name;
      if (last_name) updateData.last_name = last_name;
      if (email) updateData.email = email;

      // Perform update
      const updatedUser = await UserService.updateUserProfile(
        user_id,
        updateData
      );

      return res.status(200).json({
        message: "Profile updated successfully",
        data: {
          user_id: updatedUser.user_id.toString(),
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          email: updatedUser.email,
        },
      });
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET user profile
  async getProfile(req, res) {
    try {
      const user_id = extractUserId(req);
      if (!user_id) {
        return res.status(403).json({ message: "User not authenticated!" });
      }

      const user = await UserService.getUserById(user_id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "User profile fetched successfully",
        data: {
          user_id: user.user_id.toString(), // In case it's a BigInt
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });
    } catch (error) {
      console.error("Get profile error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE user profile
  async deleteProfile(req, res) {
    try {
      const user_id = extractUserId(req);
      console.log(user_id)
      if (!user_id) {
        return res.status(403).json({ message: "User not authenticated!" });
      }

      const user = await UserService.getUserById(user_id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await UserService.deleteUser(user_id);

      // Clear the JWT cookie
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });

      return res
        .status(200)
        .json({ message: "User account deleted successfully" });
    } catch (error) {
      console.error("Delete profile error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new UserController();
