import promisePool from '../config/database.js';

const getMetricsCtrl = {
  overallGrowth: async (req, res) => {
    try {
      // Query to fetch all data without filtering by projectID or departmentID
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
          bizznestflow2.interns i ON i.departmentID = p.departmentID
        LEFT JOIN 
          bizznestflow2.skills s ON s.toolID = pt.toolID AND s.InternID = i.InternID;
      `;

      // Execute the query
      const [result] = await promisePool.execute(query);

      // Aggregate intern skills
      const internSkills = result.reduce((acc, row) => {
        let intern = acc.find(i => i.InternID === row.InternID);

        if (!intern && row.InternID !== null && row.InternID !== undefined) {
          intern = {
            InternID: row.InternID,
            firstName: row.firstName,
            lastName: row.lastName,
            tools: [],
          };
          acc.push(intern);
        }

        if (
          intern &&
          row.skillToolID !== null &&
          row.skillToolID !== undefined &&
          !intern.tools.some(t => t.toolID === row.skillToolID)
        ) {
          intern.tools.push({
            toolID: row.skillToolID,
            skillLevel: row.skillLevel,
          });
        }

        return acc;
      }, []);

      // Aggregate project tools
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

      // Calculate total skill level and absolute increases
      const totalSkillLevel = internSkills.reduce((sum, intern) => {
        return sum + intern.tools.reduce((subSum, tool) => subSum + tool.skillLevel, 0);
      }, 0);

      const totalAbsIncrease = internSkills.reduce((sum, intern) => {
        return (
          sum +
          intern.tools.reduce((subSum, internTool) => {
            const matchingProjectTool = projects.find(project =>
              project.tools.some(pt => pt.toolID === internTool.toolID)
            )?.tools.find(t => t.toolID === internTool.toolID);

            if (matchingProjectTool) {
              const d = matchingProjectTool.difficulty;
              const s = internTool.skillLevel;
              const x = d - s;
              const absoluteIncrease = x * Math.exp(-Math.pow(x, 2));
              return subSum + absoluteIncrease;
            }
            return subSum;
          }, 0)
        );
      }, 0);

      // Create response object
      const response = {
        totalSkillLevel: parseFloat(totalSkillLevel.toFixed(2)),
        totalAbsIncrease: parseFloat(totalAbsIncrease.toFixed(4)),
        internCount: internSkills.length,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching metrics:', error.message);
      res.status(500).json({ message: 'Error fetching metrics' });
    }
  },
};

export default getMetricsCtrl;