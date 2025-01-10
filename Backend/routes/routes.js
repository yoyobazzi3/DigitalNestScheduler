import baseCtrl from '../controllers/baseCtrl.js';
import signupCtrl from '../controllers/signupCtrl.js';
import getProjectCtrl from '../controllers/getProjectCtrl.js';
import addProjectCtrl from '../controllers/addProjectCtrl.js';
import recommendationsCtrl from '../controllers/recommendationsCtrl.js';
import deleteProjectCtrl from '../controllers/deleteProjectCtrl.js';

// TODO seperate newProject and addProject Controllers in NewProjectCtrl.js
// create a new file called addProject.js and set up a seperate route for that

const routes = (app) => {
  app.route('/basePage')
    .get(baseCtrl.basePage);

    app.route('/signup')
    .post(signupCtrl.signup);

    app.route('/getProjects') 
    .get(getProjectCtrl.getProjects)

    app.route('/getProject/:projectID') // Fetch a single project by ID
    .get(getProjectCtrl.getProject);
    
    app.route('/addProject')
    .post(addProjectCtrl.addProject)

    app.route('/recommendations')
    .get(recommendationsCtrl.getRecommendations)

    app.route('/deleteProject/:projectID') // Delete a specific project
    .delete(deleteProjectCtrl.deleteProject)
};

export default routes;
