import bcrypt from "bcrypt";
import promisePool from "../config/database.js";

const resetPasswordCtrl = {
  resetPassword: async (req, res) => {
    try {
      const { token } = req.params; // Get the token from the URL
      const { password } = req.body; // Get the new password from the request body

      // Validate input
      if (!password || password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
      }

      // Find the user with the reset token and check if it's valid
      const [user] = await promisePool.query(
        "SELECT * FROM admins WHERE resetToken = ? AND resetTokenExpiry > NOW()",
        [token]
      );

      if (user.length === 0) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the password in the database and clear the reset token
      await promisePool.query(
        "UPDATE admins SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE resetToken = ?",
        [hashedPassword, token]
      );

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error in resetPasswordCtrl:", error);
      res.status(500).json({ error: "An error occurred while resetting the password" });
    }
  },
};

export default resetPasswordCtrl;