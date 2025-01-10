import promisePool from "../config/database.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

const signupCtrl = {
  signup: [
    // Validate input fields
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),

    async (req, res) => {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Extract input fields
      const { firstName, lastName, email, password, adminKey } = req.body;

      // Check if adminKey is provided
      if (!adminKey) {
        return res.status(401).json({ error: "Admin key is required to create an admin account" });
      }

      try {
        // Fetch the stored admin key from the adminKey table
        const [rows] = await promisePool.query("SELECT idadminKey FROM adminKey LIMIT 1");

        if (rows.length === 0) {
          return res.status(500).json({ error: "Admin key is not configured in the database" });
        }

        const storedAdminKey = rows[0].idadminKey;

        // Compare the provided admin key with the stored key
        if (adminKey !== storedAdminKey) {
          return res.status(401).json({ error: "Invalid admin key. You are not authorized to create an admin account" });
        }

        // Check for missing fields
        if (!firstName || !lastName || !email || !password) {
          return res.status(400).json({ error: "All fields are required" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // SQL query to insert admin data
        const sql = "INSERT INTO admins (firstName, lastName, email, password) VALUES (?, ?, ?, ?)";

        // Execute the insert query
        const [result] = await promisePool.query(sql, [firstName, lastName, email, hashedPassword]);

        // Success response
        return res.status(200).json({ message: "Admin account created successfully", insertId: result.insertId });
      } catch (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ error: "Could not create admin account" });
      }
    },
  ],
};

export default signupCtrl;