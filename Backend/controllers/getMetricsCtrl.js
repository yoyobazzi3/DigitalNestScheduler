import promisePool from '../config/database.js';

const getMetricsCtrl = {
  overallGrowth: async (req, res) => {
    try {
      // Query to sum skill levels from skills and initialSkills tables
      const skillQuery = `
        SELECT 
          COALESCE(SUM(s.skillLevel), 0) AS skillLevel_sum,
          COALESCE(SUM(initSkills.initialSkillLevel), 0) AS initialSkillLevel_sum
        FROM 
          (SELECT InternID, toolID, skillLevel FROM bizznestflow2.skills) s
        LEFT JOIN 
          (SELECT InternID, toolID, initialSkillLevel FROM bizznestflow2.initialSkills) initSkills
        ON s.InternID = initSkills.InternID AND s.toolID = initSkills.toolID;
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
  departmentGrowth: async (req, res) => {
    try {
      const query = `
        SELECT 
            d.departmentID,
            COALESCE(SUM(unique_skills.skillLevel), 0) AS skillLevel_sum,
            COALESCE(SUM(unique_initialSkills.initialSkillLevel), 0) AS initialSkillLevel_sum
        FROM 
            bizznestflow2.departments d
        LEFT JOIN 
            bizznestflow2.interns internsTbl ON d.departmentID = internsTbl.departmentID
        LEFT JOIN 
            (SELECT InternID, SUM(skillLevel) AS skillLevel FROM bizznestflow2.skills GROUP BY InternID) unique_skills 
            ON internsTbl.InternID = unique_skills.InternID
        LEFT JOIN 
            (SELECT InternID, SUM(initialSkillLevel) AS initialSkillLevel FROM bizznestflow2.initialSkills GROUP BY InternID) unique_initialSkills
            ON internsTbl.InternID = unique_initialSkills.InternID
        GROUP BY 
            d.departmentID;
      `;

      // Execute the query
      const [results] = await promisePool.execute(query);

      // Process the results in JavaScript
      const departmentMetrics = results.map(row => {
        const skillLevel_sum = parseFloat(row.skillLevel_sum.toFixed(2));
        const initialSkillLevel_sum = parseFloat(row.initialSkillLevel_sum.toFixed(2));
        
        // Compute absolute increase
        const abs_increase = parseFloat((skillLevel_sum - initialSkillLevel_sum).toFixed(2));

        // Compute percent increase (handling zero initial skill case)
        const percent_increase = initialSkillLevel_sum > 0
          ? parseFloat(((abs_increase / initialSkillLevel_sum) * 100).toFixed(2))
          : 0;

        return {
          departmentID: row.departmentID,
          skillLevel_sum,
          initialSkillLevel_sum,
          abs_increase,
          percent_increase
        };
      });

      res.status(200).json({ departmentMetrics });

    } catch (error) {
      console.error('Error fetching department metrics:', error.message);
      res.status(500).json({ message: 'Error fetching department metrics' });
    }
  },
};

export default getMetricsCtrl;
