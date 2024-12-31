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
};

export default newProjectCtrl;
