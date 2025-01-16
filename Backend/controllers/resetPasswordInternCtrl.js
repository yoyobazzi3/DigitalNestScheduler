import promisePool from "../config/database.js";
import bcrypt from "bcrypt";

const resetPasswordInternCtrl = {
  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      // Validate token for interns
      const [intern] = await promisePool.query(
        "SELECT * FROM interns WHERE resetToken = ? AND resetTokenExpiry > ?",
        [token, Date.now()]
      );

      if (intern.length === 0) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      // Hash new password and update
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await promisePool.query(
        "UPDATE interns SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE resetToken = ?",
        [hashedPassword, token]
      );

      res.status(200).json({ message: "Intern password reset successfully" });
    } catch (error) {
      console.error("Error in resetPasswordInternCtrl:", error);
      res.status(500).json({ error: "Could not reset intern password" });
    }
  },
};

export default resetPasswordInternCtrl;