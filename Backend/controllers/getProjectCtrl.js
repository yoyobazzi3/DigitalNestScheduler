import promisePool from '../config/database.js';

const getProjectCtrl = {
  /**
   * Adds a new project to the database
   */
  getProjects: async (req, res) => {
    try {
      // SELECT query
      const query = `
         SELECT projectID, projectTitle FROM bizznestflow2.projects;
      `;

      const [result] = await promisePool.execute(query);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error adding new project: ', error.message);
    res.status(500).json({ message: 'Error adding new project' })
    }
  },
};

export default getProjectCtrl;

