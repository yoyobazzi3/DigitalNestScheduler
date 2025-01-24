import baseCtrl from '../controllers/baseCtrl.js';
import signupCtrl from '../controllers/signupCtrl.js';
import getProjectCtrl from '../controllers/getProjectCtrl.js';
import addProjectCtrl from '../controllers/addProjectCtrl.js';
import recommendationsCtrl from '../controllers/recommendationsCtrl.js';
import deleteProjectCtrl from '../controllers/deleteProjectCtrl.js';
import internSignUpCtrl from '../controllers/internSignUpCtrl.js';
import getInternsCtrl from '../controllers/getInternsCtrl.js';
import loginCtrl from '../controllers/LogInCtrl.js';
import updateInternCtrl from '../controllers/updateInternCtrl.js';


const routes = (app) => {
    app.route('/basePage')
    .get(baseCtrl.basePage);

    app.route('/signup')
     .post(signupCtrl.signup);

    app.route('/login')
     .post(loginCtrl.login);

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
  
    app.route('/internSignUp')
    .post(internSignUpCtrl.internSignUp);

    app.route('/getInterns')
    .get(getInternsCtrl.getInterns);

    app.route('/getIntern/:internID')
   .get(getInternsCtrl.getIntern);

    app.route('/updateIntern/:internID')
   .put(updateInternCtrl.updateIntern);
};

export default routes;
