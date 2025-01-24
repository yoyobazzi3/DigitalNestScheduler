import promisePool from '../config/database.js';

const updateInternCtrl = {
  updateIntern: async (req, res) => {
    try {
      const { internID } = req.params;
      const { firstName, lastName, location, departmentID, frontendSkill, backendSkill, databaseSkill } = req.body;

      console.log('Received InternID:', internID);
      console.log('Received Body:', req.body);

      if (!internID || !firstName || !lastName || !location || departmentID === undefined) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      const updateInternQuery = `
        UPDATE bizznestflow2.interns 
        SET firstName = ?, lastName = ?, location = ?, departmentID = ?
        WHERE InternID = ?;
      `;
      await promisePool.execute(updateInternQuery, [firstName, lastName, location, departmentID, internID]);

      // Update or insert skills dynamically
      const skills = [
        { toolID: 0, skillLevel: frontendSkill },
        { toolID: 1, skillLevel: backendSkill }, 
        { toolID: 2, skillLevel: databaseSkill }, 
      ];

      for (const skill of skills) {
        const { toolID, skillLevel } = skill;

        // Check if the skill already exists for the intern
        const [existingSkill] = await promisePool.execute(
          `SELECT * FROM bizznestflow2.skills WHERE InternID = ? AND toolID = ?`,
          [internID, toolID]
        );

        if (existingSkill.length > 0) {
          await promisePool.execute(
            `UPDATE bizznestflow2.skills SET skillLevel = ? WHERE InternID = ? AND toolID = ?`,
            [skillLevel, internID, toolID]
          );
        } 
      }

      res.status(200).json({ message: 'Intern updated successfully!' });
    } catch (error) {
      console.error('Error updating intern:', error.message);
      res.status(500).json({ message: 'Error updating intern.' });
    }
  },
};

export default updateInternCtrl;
