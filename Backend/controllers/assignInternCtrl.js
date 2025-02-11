import promisePool from '../config/database.js';

const assignInternCtrl = {
  assignInternToProject: async (req, res) => {
    try {
      console.log("✅ Received request:", req.body); // Debug log

      const { internID, projectID, role } = req.body;

      if (!internID || !projectID) {
        console.error("❌ Missing internID or projectID:", req.body);
        return res.status(400).json({ message: 'InternID and ProjectID are required' });
      }

      // Insert the intern into the internProjects table
      const query = `
        INSERT INTO internProjects (InternID, ProjectID, role)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE role = VALUES(role);
      `;

      await promisePool.execute(query, [internID, projectID, role || 'Intern']);

      res.status(200).json({ message: 'Intern assigned successfully!' });
    } catch (error) {
      console.error('❌ Error assigning intern:', error.message);
      res.status(500).json({ message: 'Error assigning intern' });
    }
  }
};

export default assignInternCtrl;
