import promisePool from '../config/database.js';

const getProjectCtrl = {
  /**
   * Fetch all projects
   */
  getProjects: async (req, res) => {
    try {
      const query = `
        SELECT 
          p.projectID, 
          p.projectTitle,
          p.projectDescription,
          COALESCE(GROUP_CONCAT(pt.toolID ORDER BY pt.toolID ASC), '') AS projectTools, 
          COALESCE(GROUP_CONCAT(pt.difficulty ORDER BY pt.toolID ASC), '') AS difficulties
        FROM bizznestflow2.projects p
        LEFT JOIN bizznestflow2.projectTools pt ON p.projectID = pt.projectID
        GROUP BY p.projectID, p.projectTitle, p.projectDescription;
      `;

      const [result] = await promisePool.execute(query);

      const projects = result.map(project => ({
        projectID: project.projectID,
        projectTitle: project.projectTitle,
        projectDescription: project.projectDescription,
        tools: project.projectTools ? project.projectTools.split(",").map(Number) : [],
        difficulties: project.difficulties ? project.difficulties.split(",").map(Number) : []
      }));

      res.status(200).json(projects);
    } catch (error) {
      console.error('Error getting projects:', error.message);
      res.status(500).json({ message: 'Error getting projects' });
    }
  },

  /**
   * Fetch a specific project by ID
   */
  getProject: async (req, res) => {
    try {
      const { projectID } = req.params;

      if (!projectID) {
        return res.status(400).json({ message: 'ProjectID is required' });
      }

      const query = `
        SELECT 
          p.projectID, 
          p.projectTitle, 
          p.projectDescription, 
          p.departmentID, 
          pt.toolID AS projectToolID, 
          pt.difficulty
        FROM bizznestflow2.projects p
        LEFT JOIN bizznestflow2.projectTools pt ON p.projectID = pt.projectID
        WHERE p.projectID = ?;
      `;

      console.log("Executing SQL Query:", query, "with projectID:", projectID);

      const [result] = await promisePool.execute(query, [projectID]);

      if (result.length === 0) {
        return res.status(404).json({ message: 'Project not found' });
      }

      // Convert tools into an array
      const project = {
        projectID: result[0].projectID,
        projectTitle: result[0].projectTitle,
        projectDescription: result[0].projectDescription,
        departmentID: result[0].departmentID,
        tools: result
          .map(row => ({
            toolID: row.projectToolID,
            difficulty: row.difficulty
          }))
          .filter(tool => tool.toolID !== null) // Remove NULL tools
      };

      res.status(200).json(project);
    } catch (error) {
      console.log('Error getting project:', error.message);
      res.status(500).json({ message: 'Error getting project' });
    }
  }
};

export default getProjectCtrl;
