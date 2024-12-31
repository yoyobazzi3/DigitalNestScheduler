import path from 'path';
import { fileURLToPath } from 'url';
import promisePool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newProjectCtrl = {
  /**
   * Adds a new project to the database
   */
  newProject: async (req, res) => {
    try {
      // SELECT query
      const query = `
         SELECT projectTitle, projectDescription, departmentID FROM bizznestflow2.projects;
      `;

      const [result] = await promisePool.execute(query);

    res.status(200).json({
      "Data retrieved successfully":
       result // The id of the newly inserted project
    });
  } catch (error) {
    console.error('Error adding new project: ', error.message);
    res.status(500).json({ message: 'Error adding new project' })
    }
  },

  addProject: async (req, res) => {
    try {
      // Retrieve data from the request body
      const { projectTitle, projectDescription, departmentID } = req.body;
      
      // Validate request body
      if (!projectTitle || !projectDescription || !departmentID) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const query = `
      INSERT INTO bizznestflow2.projects (projectTitle, projectDescription, departmentID)
      VALUES (?, ?, ?);
      `;

      const [result] = await promisePool.execute(query, [
        projectTitle,
        projectDescription,
        departmentID,
      ]);
      res.status(200).json({
        message: 'Project added successfully!',
        projectID: result.insertID, //The id of the newly inserted project
      });
    } catch (error) {
        consoler.error('Error adding new project: ', error.message);
        res.status(500).json({ message: 'Error adding new project to the database' });
    }
  },
};

export default newProjectCtrl;