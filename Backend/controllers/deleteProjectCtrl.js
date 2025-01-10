import promisePool from '../config/database.js';

const deleteProjectCtrl = {
    deleteProject: async (req, res) => {
      try {
        const { projectID } = req.params;
  
        // Validate projectID
        if (!projectID) {
          return res.status(400).json({ message: 'Project ID is required' });
        }
  
        // Delete from projects table
        const deleteProjectQuery = `
          DELETE FROM bizznestflow2.projects WHERE projectID = ?;
        `;
        const [result] = await promisePool.execute(deleteProjectQuery, [projectID]);
  
        // Check if project was deleted
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Project not found' });
        }
  
        res.status(200).json({ message: 'Project deleted successfully' });
      } catch (error) {
        console.error('Error deleting project:', error.message);
        res.status(500).json({ message: 'Error deleting project' });
      }
    },
  };
  
  export default deleteProjectCtrl;