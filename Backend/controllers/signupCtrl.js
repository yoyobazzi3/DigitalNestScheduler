import promisePool from "../config/database.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

const internSignUpCtrl = {
  internSignUp: [
    // Validation middleware
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    body("firstName").trim().escape(),
    body("lastName").trim().escape(),
    body("location").trim().escape(),

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

        // Ensure the email is unique
        const [existingUser] = await promisePool.query("SELECT email FROM interns WHERE email = ?", [email]);
        if (existingUser.length > 0) {
          return res.status(400).json({ error: "Email already exists" });
        }

        // Sanitize DepartmentID
        const validDepartments = [0, 1, 2]; // Valid department IDs
        if (!validDepartments.includes(parseInt(DepartmentID))) {
          return res.status(400).json({ error: "Invalid DepartmentID" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into database
        const sql =
          "INSERT INTO interns (firstName, lastName, email, password, DepartmentID, location) VALUES (?, ?, ?, ?, ?, ?)";
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