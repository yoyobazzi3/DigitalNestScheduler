import promisePool from '../config/database.js';

const deleteProjectCtrl = {
  deleteProject: async (req, res) => {
    try {
      const { projectID } = req.params;

      const connection = await promisePool.getConnection();
      await connection.beginTransaction();

      await connection.execute(
        `DELETE FROM bizznestflow2.projectedGrowth WHERE projectID = ?;`,
        [projectID]
      );

      await connection.execute(
        `DELETE FROM bizznestflow2.internProjects WHERE projectID = ?;`,
        [projectID]
      );
      
      const [result] = await connection.execute(
        `DELETE FROM bizznestflow2.projects WHERE projectID = ?;`,
        [projectID]
      );

      await connection.commit();
      connection.release();

      if (result.affectedRows > 0) {
        res.status(200).json({ message: `Project ${projectID} deleted successfully.` });
      } else {
        res.status(404).json({ message: `Project ${projectID} not found.` });
      }

    } catch (error) {
      console.error("Error deleting project:", error.message);
      res.status(500).json({ message: "Error deleting project", error: error.message });
    }
  },
};

export default deleteProjectCtrl;