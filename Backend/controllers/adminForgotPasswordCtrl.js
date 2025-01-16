import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import promisePool from '../config/database.js';

const adminForgotPasswordCtrl = {
  forgotPassword: async (req, res) => {
    const { email } = req.body;

    try {
      // Check if the email exists
      const [user] = await promisePool.query('SELECT * FROM admins WHERE email = ?', [email]);
      if (user.length === 0) {
        return res.status(404).json({ error: 'Email not found' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET, // Secret key
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      // Send email with the token
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const resetLink = `http://localhost:3000/reset-password-admin/${token}`;
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        html: `<p>You requested a password reset.</p><p>Click this <a href="${resetLink}">link</a> to reset your password.</p>`,
      });

      res.status(200).json({ message: 'Password reset email sent' });
    } catch (err) {
      console.error('Error in adminForgotPasswordCtrl:', err);
      res.status(500).json({ error: 'An error occurred' });
    }
  },
};

export default adminForgotPasswordCtrl;