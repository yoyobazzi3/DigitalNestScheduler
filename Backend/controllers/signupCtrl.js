import promisePool from "../config/database.js";
import bcrypt from "bcrypt";

const signupCtrl = {
  signup: async (req, res) => {
    const { firstName, lastName, email, password, adminKey } = req.body;

    try {
      // Check for missing fields
      if (!firstName || !lastName || !email || !password || !adminKey) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Fetch the admin key from the database
      const [rows] = await promisePool.query("SELECT idadminKey FROM adminKey LIMIT 1");
      if (rows.length === 0) {
        return res.status(500).json({ error: "Admin key not configured in the database" });
      }

      const storedAdminKey = rows[0].idadminKey;

      // Validate the admin key
      if (adminKey !== storedAdminKey) {
        return res.status(401).json({ error: "Invalid admin key. You are not authorized to create an admin account" });
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
};

export default signupCtrl;