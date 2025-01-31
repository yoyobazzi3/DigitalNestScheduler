import promisePool from '../config/database.js';

const getInternsCtrl = {

  getInterns: async (req, res) => {
    try {
      const query = `SELECT InternID, firstName, lastName, departmentID, location FROM bizznestflow2.interns;`;

      const [result] = await promisePool.execute(query);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting projects: ', error.message);
    res.status(500).json({ message: 'Error getting projects' })
    }
  },

  getIntern: async (req, res) => {
    try {
      const { internID } = req.params; // Extract InternID from URL
  
      // Validate InternID
      if (!internID) {
        return res.status(400).json({ message: 'InternID is required' });
      }
  
      const query = ` SELECT  i.InternID,  i.firstName,  i.lastName, 
          i.location, 
          i.departmentID, 
          s.toolID, 
          s.skillLevel
        FROM bizznestflow2.interns i
        LEFT JOIN bizznestflow2.skills s ON i.InternID = s.InternID
        WHERE i.InternID = ?; `;
  
      const [result] = await promisePool.execute(query, [internID]);
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'Intern not found' });
      }
  
      const internData = {
        InternID: result[0].InternID,
        firstName: result[0].firstName,
        lastName: result[0].lastName,
        location: result[0].location,
        departmentID: result[0].departmentID,
        skills: result
          .filter(row => row.toolID !== null)
          .map(row => ({
            toolID: row.toolID,
            skillLevel: row.skillLevel,
          })),
      };
  
      res.status(200).json(internData);
    } catch (error) {
      console.error('Error fetching intern:', error.message);
      res.status(500).json({ message: 'Error fetching intern.' });
    }
  }
};

export default getInternsCtrl;



