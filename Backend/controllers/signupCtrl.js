import promisePool from '../config/database.js';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';

const signupCtrl = {
  signup: [
    // Validate input fields
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email, password, adminKey, csrfToken } = req.body;

      if (!adminKey) {
        return res.status(401).json({ error: 'Admin key is required to create an admin account' });
      }

      try {
        // Validate the CSRF token
        if (csrfToken !== req.csrfToken()) {
          return res.status(403).json({ error: 'Invalid CSRF token' });
        }

        // Fetch stored admin key
        const [rows] = await promisePool.query('SELECT idadminKey FROM adminKey LIMIT 1');
        if (rows.length === 0 || rows[0].idadminKey !== adminKey) {
          return res.status(401).json({ error: 'Invalid admin key' });
        }

        // Check for existing email
        const [existingUser] = await promisePool.query('SELECT email FROM admins WHERE email = ?', [email]);
        if (existingUser.length > 0) {
          return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert admin into database
        const sql = 'INSERT INTO admins (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';
        const [result] = await promisePool.query(sql, [firstName, lastName, email, hashedPassword]);

        return res.status(200).json({ message: 'Admin account created successfully', insertId: result.insertId });
      } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Could not create admin account' });
      }
    },
  ],
};

export default signupCtrl;