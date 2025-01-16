import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import promisePool from '../config/database.js';

const adminResetPasswordCtrl = {
  resetPassword: async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { email } = decoded;

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in the database
      await promisePool.query('UPDATE admins SET password = ? WHERE email = ?', [hashedPassword, email]);

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error('Error in resetPassword:', err);
      if (err.name === 'TokenExpiredError') {
        return res.status(400).json({ error: 'Token expired. Please request a new password reset.' });
      }
      res.status(500).json({ error: 'An error occurred' });
    }
  },
};

export default adminResetPasswordCtrl;