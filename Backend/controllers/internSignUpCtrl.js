import promisePool from "../config/database.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

const internSignUpCtrl = {
  internSignUp: [
    // Validation middleware
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email, password, DepartmentID, location } = req.body;

      try {
        // Validate required fields
        if (!firstName || !lastName || !email || !password || DepartmentID === undefined || !location) {
          return res.status(400).json({ error: "All fields are required" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into database
        const sql =
          "INSERT INTO interns (firstName, lastName, email, password, departmentID, location) VALUES (?, ?, ?, ?, ?, ?)";
        const [result] = await promisePool.query(sql, [
          firstName,
          lastName,
          email,
          hashedPassword,
          DepartmentID,
          location,
        ]);

        return res.status(200).json({ message: "Intern registered successfully", insertId: result.insertId });
      } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ error: "Could not register intern" });
      }
    },
  ],
};

export default internSignUpCtrl;