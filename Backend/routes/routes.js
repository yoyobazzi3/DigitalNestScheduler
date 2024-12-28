import baseCtrl from '../controllers/baseCtrl.js';

const routes = (app) => {
  app.route('/basePage')
    .get(baseCtrl.basePage);
};

export default routes;
