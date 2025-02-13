import promisePool from "../config/database.js";

const completeProjectCtrl = {
    completeProject: async (req, res) => {
        try {
        const { projectID } = req.params;
    
        // Validate projectID
        if (!projectID) {
            return res.status(400).json({ message: "Project ID is required" });
        }
    
        // Update the project status to 'completed'
        const updateProjectQuery = `
            UPDATE bizznestflow2.projects 
            SET status = 'Completed' 
            WHERE projectID = ?;
        `;
        const [result] = await promisePool.execute(updateProjectQuery, [projectID]);
    
        // Check if the project was found and updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Project not found" });
        }
    
        res.status(200).json({ message: "Project marked as completed" });
        } catch (error) {
        console.error("Error completing project:", error.message);
        res.status(500).json({ message: "Error completing project" });
        }
    },
}
export default completeProjectCtrl;