import baseCtrl from '../controllers/baseCtrl.js';
import newProjectCtrl from '../controllers/newProjectCtrl.js';

const routes = (app) => {
  app.route('/basePage')
    .get(baseCtrl.basePage);

  app.route('/newProject')
    .get(newProjectCtrl.newProject)
    
  app.route('/newProject')
    .post(newProjectCtrl.addProject)


};

export default routes;
