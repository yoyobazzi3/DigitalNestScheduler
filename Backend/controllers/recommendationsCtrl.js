import promisePool from '../config/database.js';

const recommendationsCtrl = {
  getRecommendations: async (req, res) => {
    try {
      // Extract projectID and departmentID from query parameters
      const { projectID, departmentID } = req.query;

      // Log the received query parameters
      console.log('Query Parameters:', { projectID, departmentID });

      if (!projectID || !departmentID) {
        return res.status(400).json({ message: 'Missing projectID or departmentID' });
      }

      // Query for the specific project and its tools
      const query = `
        SELECT 
          p.projectID,
          p.projectTitle,
          p.departmentID,
          pt.toolID AS projectToolID,
          pt.difficulty,
          i.InternID,
          i.firstName,
          i.lastName,
          s.toolID AS skillToolID,
          s.skillLevel
        FROM 
          bizznestflow2.projects p
        LEFT JOIN 
          bizznestflow2.projectTools pt ON p.projectID = pt.projectID
        LEFT JOIN 
          bizznestflow2.skills s ON pt.toolID = s.toolID
        LEFT JOIN 
          bizznestflow2.Interns i ON i.departmentID = p.departmentID
        WHERE 
          p.projectID = ? AND p.departmentID = ?;
      `;

      const [result] = await promisePool.execute(query, [projectID, departmentID]);

      // Aggregate data (same as before)
      const projects = result.reduce((acc, row) => {
        const project = acc.find(p => p.projectID === row.projectID);

        if (!project) {
          acc.push({
            projectID: row.projectID,
            projectTitle: row.projectTitle,
            departmentID: row.departmentID,
            tools: [],
          });
        }

        const currentProject = acc.find(p => p.projectID === row.projectID);

        if (
          row.projectToolID !== null &&
          row.projectToolID !== undefined &&
          !currentProject.tools.some(t => t.toolID === row.projectToolID)
        ) {
          currentProject.tools.push({
            toolID: row.projectToolID,
            difficulty: row.difficulty,
          });
        }

        return acc;
      }, []);

      const internSkills = result.reduce((acc, row) => {
        const intern = acc.find(i => i.InternID === row.InternID);

        if (!intern && row.InternID !== null && row.InternID !== undefined) {
          acc.push({
            InternID: row.InternID,
            firstName: row.firstName,
            lastName: row.lastName,
            departmentID: row.departmentID,
            tools: [],
          });
        }

        const currentIntern = acc.find(i => i.InternID === row.InternID);

        if (
          currentIntern &&
          row.skillToolID !== null &&
          row.skillToolID !== undefined &&
          !currentIntern.tools.some(t => t.toolID === row.skillToolID)
        ) {
          currentIntern.tools.push({
            toolID: row.skillToolID,
            skillLevel: parseFloat(row.skillLevel.toFixed(2)),
          });
        }

        return acc;
      }, []);

      res.status(200).json({ projects, internSkills });
    } catch (error) {
      console.error('Error fetching recommendations:', error.message);
      res.status(500).json({ message: 'Error fetching recommendations' });
    }
  },
};

export default recommendationsCtrl;

// import promisePool from '../config/database.js';

// const recommendationsCtrl = {
//   getRecommendations: async (req, res) => {
//     try {
//       const query = `
//         SELECT 
//           p.projectID,
//           p.projectTitle,
//           p.departmentID,
//           pt.toolID AS projectToolID,
//           pt.difficulty,
//           i.InternID,
//           i.firstName,
//           i.lastName,
//           s.toolID AS skillToolID,
//           s.skillLevel
//         FROM 
//           bizznestflow2.projects p
//         LEFT JOIN 
//           bizznestflow2.projectTools pt ON p.projectID = pt.projectID
//         LEFT JOIN 
//           bizznestflow2.skills s ON pt.toolID = s.toolID
//         LEFT JOIN 
//           bizznestflow2.Interns i ON i.InternID = s.InternID;
//       `;

//       const [result] = await promisePool.execute(query);

//       // Aggregate into projects array
//       const projects = result.reduce((acc, row) => {
//         const project = acc.find(p => p.projectID === row.projectID);

//         if (!project) {
//           acc.push({
//             projectID: row.projectID,
//             projectTitle: row.projectTitle,
//             departmentID: row.departmentID,
//             tools: [],
//           });
//         }

//         const currentProject = acc.find(p => p.projectID === row.projectID);

//         if (row.projectToolID != null && row.projectToolID !== undefined &&
//            !currentProject.tools.some(t => t.toolID === row.projectToolID)) {
//           currentProject.tools.push({
//             toolID: row.projectToolID,
//             difficulty: row.difficulty, // Format difficulty level to precision 2
//           });
//         }

//         return acc;
//       }, []);

//       // Aggregate into internSkills array
//       const internSkills = result.reduce((acc, row) => {
//         const intern = acc.find(i => i.InternID === row.InternID);
      
//         if (!intern && row.InternID !== null && row.InternID !== undefined) {
//           acc.push({
//             InternID: row.InternID,
//             firstName: row.firstName,
//             lastName: row.lastName,
//             departmentID: row.departmentID, // Include departmentID if it’s part of the result
//             tools: [],
//           });
//         }
      
//         const currentIntern = acc.find(i => i.InternID === row.InternID);
      
//         // Add tools under the current intern
//         if (
//           currentIntern &&
//           row.skillToolID !== null &&
//           row.skillToolID !== undefined &&
//           !currentIntern.tools.some(t => t.toolID === row.skillToolID)
//         ) {
//           currentIntern.tools.push({
//             toolID: row.skillToolID,
//             skillLevel: parseFloat(row.skillLevel.toFixed(2)), // Format skill level to precision
//           });
//         }
      
//         return acc;
//       }, []);

//       // Send structured response
//       res.status(200).json({ projects, internSkills });
//     } catch (error) {
//       console.error('Error fetching recommendations:', error.message);
//       res.status(500).json({ message: 'Error fetching recommendations' });
//     }
//   },
// };

// export default recommendationsCtrl;