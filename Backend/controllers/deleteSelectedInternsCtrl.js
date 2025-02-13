import promisePool from '../config/database.js';

const deleteSelectedInternsCtrl = {
    deleteSelectedInterns: async (req, res) => {
        try {
            const { internIDs, excludeInternID } = req.body;

            if (!internIDs || !Array.isArray(internIDs) || internIDs.length === 0) {
                return res.status(400).json({ message: 'Intern IDs are required' });
            }

            // Filter out the intern that should not be deleted
            const filteredInternIDs = internIDs.filter(id => id !== excludeInternID);

            if (filteredInternIDs.length === 0) {
                return res.status(400).json({ message: "No interns to delete after filtering" });
            }

            const deleteQuery = `DELETE FROM bizznestflow2.interns WHERE InternID IN (${filteredInternIDs.map(() => '?').join(', ')})`;

            const [result] = await promisePool.execute(deleteQuery, filteredInternIDs);

            if (result.affectedRows === 0) {
                return res.status(400).json({ message: "No interns were deleted" });
            }

            res.status(200).json({ message: "Selected interns deleted successfully" });

        } catch (error) {
            console.error('Error deleting interns', error.message);
            res.status(500).json({ message: 'Error deleting interns' });
        }
    }
};

export default deleteSelectedInternsCtrl;