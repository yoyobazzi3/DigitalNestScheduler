import promisePool from "../config/database.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express"; //Import express for body parsing

const router = express.Router(); //Create a router instance

// uploads to `uploads/` directory
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store inside `uploads/`
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate unique file name
  },
});

const upload = multer({ storage: storage });

//Middleware to parse request body (Fixing Validation Issue)
router.use(express.urlencoded({ extended: true })); 
router.use(express.json());

const internSignUpCtrl = {
  internSignUp: [
    upload.single("profilePic"), // Multer middleware for file upload FIRST

    // Validation middleware
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email, password, DepartmentID, location } = req.body;

      if (!firstName || !lastName || !email || !password || !DepartmentID || !location) {
        return res.status(400).json({ error: "All text fields are required" });
      }

      // Ensure the profile picture is uploaded
      if (!req.file) {
        return res.status(400).json({ error: "Profile picture is required" });
      }

      const profilePic = `/uploads/${req.file.filename}`;

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into database
        const sql = `
          INSERT INTO interns (firstName, lastName, email, password, profilePic, departmentID, location) 
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        const [result] = await promisePool.execute(sql, [
          firstName, lastName, email, hashedPassword, profilePic, DepartmentID, location
        ]);

        return res.status(200).json({ 
          message: "✅ Intern registered successfully", 
          insertId: result.insertId,
          profilePicUrl: `http://localhost:3360${profilePic}` // Return the URL of the uploaded image
        });

      } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ error: "Could not register intern" });
      }
    },
  ],
};

export default internSignUpCtrl;