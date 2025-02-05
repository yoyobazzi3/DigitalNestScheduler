import promisePool from '../config/database.js';

const getProjectCtrl = {
  /**
   * Adds a new project to the database
   */
  getProjects: async (req, res) => {
    try {
      // SELECT query
      const query = `
         SELECT projectID, projectTitle, departmentID
          pt.toolID AS projectToolID,
          pt.difficulty
         FROM bizznestflow2.projects p
         LEFT JOIN bizznestflow2.project_tools pt ON p.projectID = pt.projectID;
      `;

      const [result] = await promisePool.execute(query);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting projects: ', error.message);
    res.status(500).json({ message: 'Error getting projects' })
    }
  },
  
// Fetching specific project by ID
  getProject: async (req, res) => {
    try {
      const { projectID } = req.params;

      // Validate projectID
      if (!projectID) {
        return res.status(400).json({message: 'ProjectID is required'});
      }
      const query = `
          SELECT p.projectID, p.projectTitle, p.departmentID, 
               pt.toolID AS projectToolID, 
               pt.difficulty
        FROM bizznestflow2.projects p
        LEFT JOIN bizznestflow2.project_tools pt ON p.projectID = pt.projectID
        WHERE p.projectID = ?;
      `;
      const [result] = await promisePool.execute(query, [projectID]);
      if (result.length === 0) {
        return res.status(404).json({ message : 'Project not found' })
      }
      const project = {
        projectID: result[0].projectID,
        projectTitle: result[0].projectTitle,
        departmentID: result[0].departmentID,
        tools: result.map(row => ({
          toolID: row.projectToolID,
          difficulty: row.difficulty
        })).filter(tool => tool.toolID !== null) // Remove NULL tools
      };
      res.status(200).json(result[0]);
    } catch (error) {
      console.log('Error getting project: ', error.message);
      res.status(500).json({ message: 'Error getting project' })
    }
  }

};

export default getProjectCtrl;

