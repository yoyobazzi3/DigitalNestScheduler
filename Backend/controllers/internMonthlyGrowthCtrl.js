import promisePool from '../config/database.js';
import moment from "moment";

const monthlyGrowthCtrl = {
    getMonthlyGrowth: async (req, res) => {
        try {
            const { internID } = req.params;

            if (!internID) {
                return res.status(400).json({ success: false, message: "Intern ID is required" });
            }

            // Get last 6 months of skill history changes
            const skillHistoryQuery = `
                SELECT toolID, previousSkillLevel, updatedSkillLevel, changeDate
                FROM skillHistory
                WHERE internID = ?
                ORDER BY changeDate ASC
            `;
            const [skillHistory] = await promisePool.execute(skillHistoryQuery, [internID]);

            if (skillHistory.length === 0) {
                return res.status(404).json({ success: false, message: "No skill history found for this intern" });
            }

            // Convert changeDate to month and year
            skillHistory.forEach(entry => {
                entry.month = moment(entry.changeDate).format("MMMM");
                entry.year = moment(entry.changeDate).year();
            });

            // Get project difficulties for matching toolIDs
            const toolIDs = [...new Set(skillHistory.map(skill => skill.toolID))]; // Unique toolIDs
            const projectQuery = `
                SELECT toolID, difficulty 
                FROM projectTools
                WHERE toolID IN (${toolIDs.join(',')})
            `;
            const [projects] = await promisePool.execute(projectQuery);

            if (projects.length === 0) {
                return res.status(404).json({ success: false, message: "No matching project data found" });
            }

            // Compute absolute growth for each skill update
            let growthByMonth = {};

            skillHistory.forEach(skill => {
                const project = projects.find(p => p.toolID === skill.toolID);
                if (!project) return; // Skip if no matching project found

                const x = project.difficulty - skill.updatedSkillLevel; // Compute x
                const absoluteGrowth = x * Math.exp(-(x ** 2)); // Apply function
                const growthPercentage = skill.updatedSkillLevel > 0 
                    ? (Math.abs(absoluteGrowth) / skill.updatedSkillLevel) * 100 
                    : 0;

                // Group growth by month and year
                const key = `${skill.month} ${skill.year}`;
                if (!growthByMonth[key]) {
                    growthByMonth[key] = { month: skill.month, year: skill.year, totalGrowth: 0, count: 0 };
                }
                growthByMonth[key].totalGrowth += growthPercentage;
                growthByMonth[key].count += 1;
            });

            // Convert to sorted array for cumulative calculations
            let sortedGrowthData = Object.values(growthByMonth).map(entry => ({
                month: entry.month,
                year: entry.year,
                growthPercentage: parseFloat((entry.totalGrowth / entry.count).toFixed(2)) // Average growth
            })).sort((a, b) => moment(`${a.month} ${a.year}`, "MMMM YYYY").diff(moment(`${b.month} ${b.year}`, "MMMM YYYY")));

            // **Make Growth Cumulative**
            for (let i = 1; i < sortedGrowthData.length; i++) {
                sortedGrowthData[i].growthPercentage += sortedGrowthData[i - 1].growthPercentage;
            }

            res.json({ success: true, data: sortedGrowthData });
        } catch (error) {
            console.error("Error fetching monthly growth:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
};

export default monthlyGrowthCtrl;