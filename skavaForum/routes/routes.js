var appRouter = function(app){
    var controllerObj = require("../controllers/controller.js");
    app.route("/api/rest/createAccount").post(controllerObj.createAccount);
    app.route("/api/rest/login").post(controllerObj.signIn);
    app.route("/api/rest/logout").get(controllerObj.signout);
    app.route("/api/rest/addUserQuestion").post(controllerObj.addUserQuestion);
    app.route("/api/rest/addUserAnswer").post(controllerObj.addUserAnswer);
    app.route("/api/rest/forgotPassword").post(controllerObj.forgotPwd);
    app.route("/api/rest/getAnswer").post(controllerObj.getAnswer);
    app.route("/api/rest/getRelatedQuestions").post(controllerObj.getRelatedQuestion);
	app.route("/reset/:token").get(controllerObj.resetPassword);
    app.route("/reset/updatePassword").post(controllerObj.updatePaswword);
    app.route("/api/rest/getQuestions").post(controllerObj.getQuestions);
    app.route("/api/rest/getQuqAnsById").post(controllerObj.getQuqAnsById);
    app.route("/api/rest/getTagsByUserId").get(controllerObj.getTagsByUserId);
    app.route("/api/rest/getMailIdByUserId").post(controllerObj.getMailIdByUserId);
    app.route("/api/rest/sendMail").post(controllerObj.sendMailNotify);
    app.route("/api/rest/getProfileData").get(controllerObj.getProfile);
    app.route("/api/rest/deleteAnswer").post(controllerObj.deleteAnswer);
    app.route("/api/rest/addComment").post(controllerObj.addComments);
    app.route("/api/rest/deleteComment").post(controllerObj.deleteComment);
    app.route("/api/rest/socialLogin").post(controllerObj.handleSocialLogin);
}
module.exports = appRouter;