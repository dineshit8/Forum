var appRouter = function(app){
    var controllerObj = require("../controllers/controller.js");
    app.route("/api/rest/welcome").get(controllerObj.getWelcomeMsg);
    app.route("/api/rest/createAccount").post(controllerObj.createAccount);
    app.route("/api/rest/login").post(controllerObj.signIn);
    app.route("/api/rest/logout").get(controllerObj.signout);
    app.route("/api/rest/addUserQuestion").post(controllerObj.addUserQuestion);
    app.route("/api/rest/addUserAnswer").post(controllerObj.addUserAnswer);
    app.route("/api/rest/forgotPassword").post(controllerObj.forgotPwd);
    app.route("/api/rest/getAnswer").post(controllerObj.getAnswer);
}
module.exports = appRouter;