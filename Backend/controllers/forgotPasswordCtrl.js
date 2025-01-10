import crypto from "crypto";
import nodemailer from "nodemailer";
import promisePool from "../config/database.js";

const forgotPasswordCtrl = {
forgotPassword: async (req, res) => {  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const [user] = await promisePool.query("SELECT * FROM admins WHERE email = ?", [email]);
    if (user.length === 0) {
      return res.status(404).json({ error: "Email not found" });
    }

    // Generate a unique token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour

    // Save token and expiry in the database
    await promisePool.query(
      "UPDATE admins SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?",
      [token, tokenExpiry, email]
    );

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or another service
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    // Send password reset email
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset.</p><p>Click this <a href="${resetLink}">link</a> to reset your password.</p>`,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error in forgotPasswordCtrl:", error);
    res.status(500).json({ error: "An error occurred" });
  }
}
}

export default forgotPasswordCtrl;