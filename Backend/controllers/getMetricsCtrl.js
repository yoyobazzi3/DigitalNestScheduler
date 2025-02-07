import promisePool from '../config/database.js';

const getMetricsCtrl = {
  overallGrowth: async (req, res) => {
    try {
      // Query to sum skill levels from skills and initialSkills tables
      const skillQuery = `
        SELECT 
          COALESCE(SUM(s.skillLevel), 0) AS skillLevel_sum,
          COALESCE(SUM(is.initialSkillLevel), 0) AS initialSkillLevel_sum
        FROM 
          (SELECT InternID, toolID, skillLevel FROM bizznestflow2.skills) s
        LEFT JOIN 
          (SELECT InternID, toolID, initialSkillLevel FROM bizznestflow2.initialSkills) is
        ON s.InternID = is.InternID AND s.toolID = is.toolID;
      `;

      // Execute the query
      const [result] = await promisePool.execute(skillQuery);

      // Extract the aggregated values
      const skillLevel_sum = parseFloat(result[0].skillLevel_sum.toFixed(2));
      const initialSkillLevel_sum = parseFloat(result[0].initialSkillLevel_sum.toFixed(2));

      // Compute absolute increase
      const abs_increase = parseFloat((skillLevel_sum - initialSkillLevel_sum).toFixed(2));

      // Compute percent increase (handling zero initial skill case)
      const percent_increase = initialSkillLevel_sum > 0
        ? parseFloat(((abs_increase / initialSkillLevel_sum) * 100).toFixed(2))
        : 0;

      // Create response object
      const response = {
        overallSkills: {
          skillLevel_sum,
          initialSkillLevel_sum,
          abs_increase,
          percent_increase,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching metrics:', error.message);
      res.status(500).json({ message: 'Error fetching metrics' });
    }
  },
};

export default getMetricsCtrl;
