import promisePool from "../config/database.js";

const signupCtrl = {
  signup: async (req, res) => {
    try {

      console.log("Received data:", req.body);
      
      const { firstName, lastName, email, password } = req.body;

      // Check for missing fields
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // SQL query to insert user data
      const sql = "INSERT INTO admins (firstName, lastName, email, password) VALUES (?, ?, ?, ?)";
      
      // Execute query
      const [result] = await promisePool.query(sql, [firstName, lastName, email, password]);
      
      // Success response
      return res.status(200).json({ message: "Inserted successfully", insertId: result.insertId });
    } catch (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Could not insert data" });
    }
  },
};

export default signupCtrl;
