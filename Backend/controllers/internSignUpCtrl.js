import promisePool from "../config/database.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import multer from "multer";

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const internSignUpCtrl = {
  internSignUp: [
    // Validation middleware
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),

    // Multer middleware for file upload
    upload.single("profilePic"),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email, password, DepartmentID, location } = req.body;
      const profilePic = req.file ? req.file.filename : null; // Get binary data

      try {
        // Validate required fields
        if (!firstName || !lastName || !email || !password || DepartmentID === undefined || !location) {
          return res.status(400).json({ error: "All fields are required, including profile picture" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into database
        const sql = `
          INSERT INTO interns (firstName, lastName, email, password, profilePic, departmentID, location) 
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        const [result] = await promisePool.execute(sql, [
          firstName, lastName, email, hashedPassword, profilePic, DepartmentID, location
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