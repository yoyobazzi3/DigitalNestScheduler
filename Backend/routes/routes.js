import baseCtrl from '../controllers/baseCtrl.js';
import signupCtrl from '../controllers/signupCtrl.js';
import getProjectCtrl from '../controllers/getProjectCtrl.js';
import addProjectCtrl from '../controllers/addProjectCtrl.js';
import recommendationsCtrl from '../controllers/recommendationsCtrl.js';
import internSignUpCtrl from '../controllers/internSignUpCtrl.js';

const routes = (app) => {
  app.route('/basePage').get(baseCtrl.basePage);

  app.route('/signup').post(signupCtrl.signup);

  app.route('/getProjects').get(getProjectCtrl.getProjects);

  app.route('/addProject').post(addProjectCtrl.addProject);

  app.route('/recommendations').get(recommendationsCtrl.getRecommendations);

  app.route('/internSignUp').post(internSignUpCtrl.internSignUp);
};

export default routes;