import promisePool from "../config/database.js";
import bcrypt from 'bcrypt'

const signupCtrl = {
  signup: async (req, res) => {
    try {

      const { firstName, lastName, email, password } = req.body;

      // Check for missing fields
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      // SQL query to insert user data
      const sql = "INSERT INTO admins (firstName, lastName, email, password) VALUES (?, ?, ?, ?)";
      
      // Execute query
      const [result] = await promisePool.query(sql, [firstName, lastName, email, hashedPassword]);
      
      // Success response
      return res.status(200).json({ message: "Inserted successfully", insertId: result.insertId });
    } catch (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Could not insert data" });
    }
  },
};

export default signupCtrl;
