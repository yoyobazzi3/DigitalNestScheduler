import baseCtrl from '../controllers/baseCtrl.js';
import signupCtrl from '../controllers/signupCtrl.js';
import getProjectCtrl from '../controllers/getProjectCtrl.js';
import addProjectCtrl from '../controllers/addProjectCtrl.js';

// TODO seperate newProject and addProject Controllers in NewProjectCtrl.js
// create a new file called addProject.js and set up a seperate route for that

const routes = (app) => {
  app.route('/basePage')
    .get(baseCtrl.basePage);

    app.route('/signup')
    .post(signupCtrl.signup);

    app.route('/getProjects')
    .get(getProjectCtrl.getProjects)
    
  app.route('/addProject')
    .post(addProjectCtrl.addProject)
};

export default routes;
