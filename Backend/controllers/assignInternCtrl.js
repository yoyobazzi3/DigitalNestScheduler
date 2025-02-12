import promisePool from '../config/database.js';

const assignInternCtrl = {
  assignInternToProject: async (req, res) => {
    try {
      console.log("Received request:", req.body); // Debug log

      const interns = req.body;

      if (!Array.isArray(interns) || !interns.length) {
        console.error("No interns received: ", req.body);
        return res.status(400).json({ message: 'InternID and ProjectID are required' });
      }

      // Insert the intern into the internProjects table
      const query = `
        INSERT INTO internProjects (InternID, ProjectID, role)
        VALUES ${interns.map(() => "(?, ?, ?)").join(", ")}
        ON DUPLICATE KEY UPDATE role = VALUES(role);
      `;

      const values = interns.flatMap(({ internID, projectID, role }) => [internID, projectID, role || 'Intern']);

      await promisePool.execute(query, values);

      res.status(200).json({ message: 'Intern assigned successfully!' });
    } catch (error) {
      console.error('Error assigning intern:', error.message);
      res.status(500).json({ message: 'Error assigning intern' });
    }
  }
};

export default assignInternCtrl;
