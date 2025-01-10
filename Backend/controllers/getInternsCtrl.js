import promisePool from '../config/database.js';

const getInternsCtrl = {

  getInterns: async (req, res) => {
    try {
      const query = `
         SELECT InternID, firstName, lastName FROM bizznestflow2.interns;
      `;

      const [result] = await promisePool.execute(query);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting projects: ', error.message);
    res.status(500).json({ message: 'Error getting projects' })
    }
  },
};

export default getInternsCtrl;



