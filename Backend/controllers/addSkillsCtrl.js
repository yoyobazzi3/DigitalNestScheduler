import promisePool from '../config/database.js';

const addSkillsCtrl = {
    addSkills: async (req, res) => {
        try {
           const { internID } = req.params; // Get internID from URL params
           const { webDevSkills = {}, designSkills = {}, filmSkills = {} } = req.body;

           console.log('Recieved InternID: ', internID);
           console.log('Received Skills: ', req.body);

           // Validate required fields
           if (!internID) {
             return res.status(400).json({ message: 'InternID is required.' });
           }

           // Ensure intern exists before proceeding
           const [internExists] = await promisePool.execute(
            `SELECT InternID FROM bizznestflow2.interns WHERE InternID = ?`,
            [internID]
           );

           if (internExists.length === 0) {
            return res.status(400).json({ message: 'Intern not found.' });
           }

           // Prepare skills array
           const skills = [
            ...Object.entries(webDevSkills).map(([toolID, skillLevel]) => ({ toolID: Number(toolID), skillLevel })),
            ...Object.entries(designSkills).map(([toolID, skillLevel]) => ({ toolID: Number(toolID), skillLevel })),
            ...Object.entries(filmSkills).map(([toolID, skillLevel]) => ({ toolID: Number(toolID), skillLevel })),
           ];

           for (const skill of skills) {
            const { toolID, skillLevel } = skill;

            if (toolID === undefined || skillLevel === undefined) continue;

            // Insert skills into skills table
            await promisePool.execute(
                `INSERT INTO bizznestflow2.skills (InternID, toolID, skillLevel)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE skillLevel = VALUES(skillLevel)`,
                 [internID, toolID, skillLevel]
            );

            // Check if skill exists in initialSkills table
            const [existingInitialSkill] = await promisePool.execute(
                `SELECT * FROM bizznestflow2.initialSkills WHERE InternID = ? AND toolID = ?`,
                [internID, toolID]
            );

            if (existingInitialSkill.length === 0) {
                // Insert into initialSkills table (only first time insert)
                await promisePool.execute(
                `INSERT INTO bizznestflow2.initialSkills (InternID, toolID, initialSkillLevel)
                VALUES (?, ?, ?)`,
                [internID, toolID, skillLevel]
                );
            }
        }

        res.status(201).json({ message: "Skills added successfully"})
        } catch (error) {
          console.error('Error adding skills: ', error.message);
          res.status(500).json({ message: 'Error adding skills' })
        }
    },
};

export default addSkillsCtrl;