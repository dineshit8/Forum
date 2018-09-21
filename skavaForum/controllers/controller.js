var modelObj = require("../models/model.js");
const bcrypt = require('../server.js').bcrypt;
var crypto = require('crypto');
var nodemailer = require('nodemailer');
exports.getWelcomeMsg = function(req,res){
    res.status(200).send({message:"Welcome to Skava Forum"});
}

exports.createAccount = function(req , res) {
    var contype = req ? req.headers['content-type'] : "";
    if(contype && contype.indexOf('application/json') >=0)
    {
        req.checkBody('userName','User Name is required').notEmpty();
        req.checkBody('mailId', 'Mail Id is required').isEmail();
        if(req.checkBody('passWord', 'PassWord is required').notEmpty())
        {
            req.checkBody('passWord','Password should match the valid pattern.').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i");
        }
        req.checkBody('tags','tags field must not be empty').notEmpty();
        var errors = req.validationErrors();
        if(errors)
        {
            res.send(errors);
        }
        else
        {
            var manipulatedReq = {};
            manipulatedReq.userName = req.body.userName;
            manipulatedReq.mailId = req.body.mailId;
            manipulatedReq.passWord = req.body.passWord;
            manipulatedReq.tags = req.body.tags;
            modelObj.getuser(manipulatedReq, res, function (err, result) {
            if (result && result.mailId)
            {
                res.status(200).json({ message: "User already exists with the same mail id !","status":"Failure" });
            } 
            else if(err && err == "User profile not found.")
            {
                hashPwd(manipulatedReq.passWord , function(response)
                {
                    if(response)
                    {
                        manipulatedReq.passWord = response;
                        var mail = manipulatedReq.mailId;
                        manipulatedReq.userId = "SKA"+(Math.floor(Math.random() * 90000) + 10000) + mail.split("@")[0].toUpperCase();
                        manipulatedReq.joinDate = new Date(Date.now()).toDateString();
                        modelObj.addUser(manipulatedReq, res, function (err, result) {
                            if (err) {
                            res.status(200).json({ message: 'Failure' });
                            } else {
                            res.status(200).json({ message: 'Your account has been created successfully' , "status":"Success"});
                            }
                        });
                    }
                    else
                    {
                        res.status(200).json({ message: 'Hashing Failed' });
                    }
                });
            }
            });
        }
    }
    else
    {
        res.status(400).json({ message:'Bad Request',status: 'Failure'});
    }
}

exports.signIn = function(req , res) 
{
    var contype = req ? req.headers['content-type'] : "";
    if(contype && contype.indexOf('application/json') >=0)
    {
        var requestBody =  req.checkBody;
        requestBody('mailId', 'Mail_Id is required').isEmail();
        if(requestBody('passWord', 'PassWord is required').notEmpty())
        {
            requestBody('passWord','Password should match the valid pattern.').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i");
        }
        var errors = req.validationErrors();
        if(errors)
        {
            res.send(errors);
        }
        else
        {
            var manipulatedReq = {};
            manipulatedReq.mailId = req.body.mailId;
            manipulatedReq.passWord = req.body.passWord;
            modelObj.getuser(manipulatedReq, res, function (err, result) {
                if (err)
                {
                        res.status(200).json({ message: err , "status":"Failure"});
                } 
                else 
                {
                    comparePwd(manipulatedReq.passWord , result.passWord , function(response)
                    {
                        if(response)
                        {
                            var session = req.session;
                            session.userId = result.userId;
                            session.userName = result.userName;
                            session.userMail = result.mailId;
                            req.session.save();
                            //res.cookie('s_Ts_cookie', 1, {maxAge: 300000, Path : "/"});
                            res.cookie('userId',result.userId,{maxAge:300000,Path:"/"});
                            res.status(200).json({"user_name" : result.userName ,"userId": result.userId , message : "You have been logged into your account successfully.", "status":"Success"});
                        }
                        else
                        {
                            res.status(200).json({message : "Password incorrect!."});
                        }
                    });
                
                }
            });
        }
    }
    else
    {
        res.status(400).json({ message:'Bad Request',status: 'Failure'});
    }
}
exports.getProfile = function(req , res)
{
    if(req.session.userId)
    {
        var manipulatedReq = {};
        manipulatedReq.mailId = req.session.userMail;
        modelObj.getuser(manipulatedReq, res, function (err, result) {
            if (err)
            {
                res.status(200).json({ message: err , "status":"Failure"});
            } 
            else 
            {
                result.passWord = "*****";
                res.status(200).json({"status":"success",children : result})
            }
        });
    }
}
exports.deleteAnswer = function(req, res)
{
    var contype = req ? req.headers['content-type'] : "";
    if(contype && contype.indexOf('application/json') >=0 && req && req.session.userId)
    {
        var requestBody =  req.checkBody;
        requestBody('answerId', 'answerId is required').notEmpty();
        requestBody('questionId', 'questionId is required').notEmpty()
        var errors = req.validationErrors();
        if(errors)
        {
            res.send(errors);
        }
        else
        {
        var manipulatedReq = {};
        manipulatedReq.ansid = req.body.answerId;
        manipulatedReq.qid = req.body.questionId;
         modelObj.deleteAnswer(manipulatedReq, res, function (err, result) 
            {
                if (err)
                {
                    res.status(200).json({ message: err , "status":"Failure"});
                } 
                else 
                {
                    res.status(200).json({"status":"success",children : result})
                }
            });
        }
    }
}
exports.addComments = function(req , res)
{
    var contype = req ? req.headers['content-type'] : "";
    if(contype && contype.indexOf('application/json') >=0 && req && req.session.userId)
    {
        var requestBody =  req.checkBody;
        requestBody('commentDesc', 'commentDesc is required').notEmpty();
        requestBody('answerId', 'answerId is required').notEmpty();
        requestBody('questionId', 'questionId is required').notEmpty()
        var errors = req.validationErrors();
        if(errors)
        {
            res.send(errors);
        }
        else
        {
            var manipulatedReq = {};
            manipulatedReq.ansid = req.body.answerId;
            manipulatedReq.qid = req.body.questionId;
            manipulatedReq.commentDesc = req.body.commentDesc;
            manipulatedReq.userName = req.session.userName;
            manipulatedReq.userId = req.session.userId;
            manipulatedReq.commentId = Math.floor(Math.random() * 1000000000000) + new Date().getTime();
            modelObj.addComment(manipulatedReq, res, function (err, result) 
            {
                if (err)
                {
                    res.status(200).json({ message: err , "status":"Failure"});
                } 
                else 
                {
                    res.status(200).json({"status":"success",message : "Comments Added"})
                }
            });
        }
    }
    else{
        res.cookie('userId', "",{ Path:'/'});
        res.status(200).json({"status":"Failure",message : "Kindly login"});
    }
}
exports.deleteComment = function(req , res)
{
    var contype = req ? req.headers['content-type'] : "";
    if(contype && contype.indexOf('application/json') >=0 && req && req.session.userId)
    {
        var requestBody =  req.checkBody;
        requestBody('answerId', 'answerId is required').notEmpty();
        requestBody('questionId', 'questionId is required').notEmpty();
        requestBody('commentId', 'commentId is required').notEmpty();
        var errors = req.validationErrors();
        if(errors)
        {
            res.send(errors);
        }
        else
        {
            var manipulatedReq = {};
            manipulatedReq.ansid = req.body.answerId;
            manipulatedReq.qid = req.body.questionId;
            manipulatedReq.commentId = req.body.commentId;
            modelObj.deleteComment(manipulatedReq, res, function (err, result) 
            {
                if (err)
                {
                    res.status(200).json({ message: err , "status":"Failure"});
                } 
                else 
                {
                    res.status(200).json({"status":"success",message : "Comments Deleted"})
                }
            });
        }
    }
    else{
        res.cookie('userId', "",{ Path:'/'});
        res.status(200).json({"status":"Failure",message : "Kindly login"});
    }
}
exports.signout = function(req , res) 
{
    req.session.save( function(err) {
    req.session.destroy(function(err) {
            if(err) 
          console.log(err);
      });
    });
    res.cookie('userId', "",{ Path:'/'});
    res.status(200).send({message:"Logout Success","status":"success"});
}

exports.addUserQuestion = function(req, res) {
    var contype = req ? req.headers['content-type'] : "";
    console.log("Question Content type : " + contype);
    if (contype && contype.indexOf('application/json') >= 0) {
        var requestBody = req.checkBody;
        requestBody('UserId', 'UserId is required').notEmpty();
        if (requestBody('RelatedTags', 'Tag is required').notEmpty()) {
            requestBody('RelatedTags', 'Tag should be array').isArray();
        }
        requestBody('Title', 'Title is required').notEmpty();
        requestBody('Description', 'Question Description is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            res.send(errors);
        } else {
            var reqObj = {};
            reqObj.questionId = Math.floor(Math.random() * 1000000000000) + new Date().getTime();
            reqObj.userId = req.body.UserId;
            reqObj.relatedTags = req.body.RelatedTags;
            reqObj.title = req.body.Title;
            reqObj.description = req.body.Description;
            reqObj.postedDate = new Date();
            reqObj.postedUserName = req.session.userName;
            modelObj.addQuestion(reqObj, res, function(err, result) {
                if (err) {
                    res.status(200).json({ message: 'Failure' });
                } else {
                    res.status(200).json({ message: "Question updated sucessfully", status: 'Success' });
                }
            });
        }
            else
            {
                res.cookie('userId', "",{ Path:'/'});
                res.status(200).json({  message: 'session timed out' });
            }
            
        }
    } else {
        res.status(400).json({ message: 'Bad Request', status: 'Failure' });
    }
    sessionReload(req);
}

exports.addUserAnswer = function(req, res) {
    var contype = req ? req.headers['content-type'] : "";
    console.log("Answer Content type : " + contype);
    if (contype && contype.indexOf('application/json') >= 0) {
        var requestBody = req.checkBody;
        if (requestBody('QuestionId', 'QuestionId is required').notEmpty()) {
            requestBody('QuestionId', 'QuestionId is not valid').isInt();
        }
        //requestBody('UserId', 'UserId is required').notEmpty();
        requestBody('Description', 'Description is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            res.send(errors);
        } else {
            var reqObj = {};
            reqObj.questionId = parseFloat(req.body.QuestionId);
            reqObj.answerId = Math.floor(Math.random() * 1000000000000) + new Date().getTime();
            reqObj.userId = req.session.userId;
            reqObj.description = req.body.Description;
            if(req.session.userName)
            {
            reqObj.userName = req.session.userName;
            modelObj.addAnswer(reqObj, res, function(err, result) {
                if (err) {
                    res.status(200).json({ message: 'Failure' });
                } else {
                    res.status(200).json({ message: "Answer updated sucessfully", status: 'Success' });
                }
            });
        }
            else{
                res.cookie('userId', "",{ Path:'/'});
                res.status(200).json({ message: 'Failure' });
                
            }
        }
    } else {
        res.status(400).json({ message: 'Bad Request', status: 'Failure' });
    }
    sessionReload(req);
}

exports.getAnswer = function(req, res) {
    var contype = req ? req.headers['content-type'] : "";
    if (contype && contype.indexOf('application/json') >= 0) {
        var requestBody = req.checkBody;
        if (requestBody('QuestionId', 'QuestionId is required').notEmpty()) {
            requestBody('QuestionId', 'QuestionId should be integer').isInt();
        }
        var errors = req.validationErrors();
        if (errors) {
            res.send(errors);
        } else {
            modelObj.getAnswerByQuesId(req, res, function(err, result) {
                if (err) {
                    res.status(200).json({ message: 'Failure' });
                } else {
                    res.status(200).send(result);
                }
            });
        }
    } else {
        res.status(400).json({ message: 'Bad Request', status: 'Failure' });
    }
    sessionReload(req);
}
exports.forgotPwd = function(req,res)
{
    var contype = req ? req.headers['content-type'] : "";
    if (contype && contype.indexOf('application/json') >= 0) {
        var requestBody = req.checkBody;
        requestBody('mailId', 'Enter a valid Mail Id').isEmail();
        var errors = req.validationErrors();
        if(errors)
        {
            res.status(200).json(errors)
        }
        else
        {
            var manipulatedReq = {};
            manipulatedReq.mailId = req.body.mailId;
            generateToken(function(res)
            {
                manipulatedReq.token = res;
            })
            modelObj.forgotPwd(manipulatedReq, res, function(err, result) {
               if(err)
               {
                   res.status(200).json({"status":"Failure",message : err})
               }
                if(result)
               {
                var smtpTransport = nodemailer.createTransport(
                    {  
                        service: 'gmail',  
                        auth: {  
                        user: "skavaforum@gmail.com",  
                        pass: "developers@123"  
                        }  
                    }); 
                const mailOptions = {  
                    to: req.body.mailId,  
                    from: 'passwordreset@demo.com',  
                    subject: 'Node.js Password Reset',  
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +  
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +  
                        'http://'+ req.headers.host  +'/reset?' + manipulatedReq.token + '\n\n' +  
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'  
                }; 
                smtpTransport.sendMail(mailOptions, function(err) {                 
                    res.json({status : 'success', message : 'An e-mail has been sent to the above mail-Id with further instructions.'});              
                    //done(err, 'done');  
                });  
               }
            });
        }
    }
}

exports.getRelatedQuestion = function(req,res) {
    var contentType = req.headers['content-type'] ? req.headers['content-type'] : "";
    if(contentType && contentType.indexOf('application/json') != -1) {
        req.checkBody('keyWords','Please enter a valid search term.').notEmpty();
        var errors = req.validationErrors();
        if(errors) {
            res.send(errors);
        }
        else {
            modelObj.getRelatedQuest(req, res, function(err, result) {
                if (err) {
                    res.status(400).json({ message:'Something went wrong. Please try with another search term.', status: 'Failure' });
                  } else {
                    res.status(200).json(result);
                  }
            })
        }
    }
    else
    {
        res.status(400).json({ message:'Bad Request',status: 'Failure'});
    }
}
exports.resetPassword = function(req,res)
{
    if(req)
    {
        modelObj.resetPassword(req, res, function(err, result) {
            if (err) {
                res.status(200).json({ message: 'Failure' });
            } else {
                res.status(200).send({status : 'success' , "message":"Password reset accepted."});
            }
        });
    }
}
exports.updatePaswword = function(req,res)
{
    if(req)
    {
        hashPwd(req.body.PassWord , function(response)
        {
            var manipulatedReq = {};
            manipulatedReq.token = req.body.token;
            manipulatedReq.passkey = response;
            modelObj.updatePaswword(manipulatedReq , res ,function(err,result)
            {
                if(err){
                    res.status(200).json({message : 'Failure'});
                }
                else{
                    res.status(200).send({status: 'success' , 'message' : "Paswword resetted successfully."});
                }
            });
        });
    }
}
exports.getQuestions = function(req, res) {
    modelObj.getQuestions(req, res, function(err, result) 
        {
            if(err)
            {
                res.status(200).json({"status":"Failure",message : err})
            }
            else
            {
                res.status(200).json({"status":"success",message : result})
            }
    });
}
exports.getQuqAnsById = function(req, res) {
    var contentType = req.headers['content-type'] ? req.headers['content-type'] : "";
    if(contentType && contentType.indexOf('application/json') != -1) {
        modelObj.getQuqAnsById(req, res, function(err, result) 
        {
            if(err) 
            {
                res.status(200).json({"status":"Failure",message : err})
            }
            if(result)
            {
               res.status(200).json({"status":"success",children : result})
            }
        });
    }
    sessionReload(req);
}
exports.getTagsByUserId = function(req, res) {
    if(req)
    {
        modelObj.getValueByUserId(req, res, "tags", function(err, result) 
        {
            if(err) 
            {
                res.status(200).json({"status":"Failure",message : err})
            }
            if(result)
            {
                res.status(200).json({"status":"success",children : result})
            }
        });
        sessionReload(req);
    }   
}
exports.getMailIdByUserId = function(req, res) {
    if(req)
    {
        manipulatedReq = {};
        manipulatedReq.userId = req.body.userId;
        modelObj.getValueByUserId(manipulatedReq, res, "mail", function(err, result) 
        {
            if(err) 
            {
                res.status(200).json({"status":"Failure",message : err})
            }
            if(result)
            {
                res.status(200).json({"status":"success",children : result})
            }
        });
        sessionReload(req);
    }   
}
exports.sendMailNotify = function(req, res)
{
    if(req)
    {
        var manipulatedReq = {};
        manipulatedReq.questionId = req.body.Qid;
        manipulatedReq.mailId = req.body.mailId;
        var smtpTransport = nodemailer.createTransport(
            {  
                service: 'gmail',  
                auth: {  
                user: "skavaforum@gmail.com",  
                pass: "developers@123"  
                }  
            }); 
        const mailOptions = {  
            to: manipulatedReq.mailId,  
            from: 'passwordreset@demo.com',  
            subject: 'Hey your question has got an answer :) ',  
            text: 'The question which you posted in Skava Forum has been answered by someone.\n\n' +  
                'Please click on the following link, or paste this into your browser to view the answer:\n\n' +  
                'http://'+ req.headers.host  +'/Qa?id=' + manipulatedReq.questionId + '\n\n' +  
                'Keep posting your valuable questions... Thanks !! .\n'  
        }; 
        smtpTransport.sendMail(mailOptions, function(err) {                 
            res.json({status : 'success', message : 'An e-mail has been sent to the above mail-Id with further instructions.'});              
            //done(err, 'done');  
        });  
    }
}

// custom functions
function hashPwd(pwd , cbk)
{
    bcrypt.hash(pwd, 5 , function(err, hash) {
        cbk(hash);
      });
}
function comparePwd(pwd , hash , cbk)
{
    bcrypt.compare(pwd, hash, function(err, res) {
       cbk(res);
    });
}
function generateToken(cbk)
{
    crypto.randomBytes(20, function(err, buf) {  
        var token = buf.toString('hex');  
        cbk(token)
    }); 
   
}
function sessionReload(req)
{
    req.session.save( function(err) {
    req.session.reload(function(err) {
        });
      });
}