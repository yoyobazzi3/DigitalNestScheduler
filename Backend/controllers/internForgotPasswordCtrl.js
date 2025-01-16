import promisePool from "../config/database.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const internForgotPasswordCtrl = {
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Check if intern email exists
      const [intern] = await promisePool.query("SELECT * FROM interns WHERE email = ?", [email]);
      if (intern.length === 0) {
        return res.status(404).json({ error: "Intern email not found" });
      }

      // Generate token and expiry
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour validity

      // Update token and expiry in database
      await promisePool.query(
        "UPDATE interns SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?",
        [resetToken, resetTokenExpiry, email]
      );

      // Send reset email
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const resetLink = `http://localhost:3000/reset-password-intern/${resetToken}`;
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Intern Password Reset Request",
        html: `<p>You requested a password reset.</p><p>Click this <a href="${resetLink}">link</a> to reset your password.</p>`,
      });

      res.status(200).json({ message: "Password reset email sent to intern" });
    } catch (error) {
      console.error("Error in internForgotPasswordCtrl:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  },
};

export default internForgotPasswordCtrl;