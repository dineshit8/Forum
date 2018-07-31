var modelObj = require("../models/model.js");
const bcrypt = require('bcrypt');
exports.getWelcomeMsg = function(req,res){
    res.status(200).send({message:"Welcome to Skava Forum"});
}

exports.createAccount = function(req , res) {
    var contype = req ? req.headers['content-type'] : "";
    if(contype && contype.indexOf('application/json') >=0)
    {
        req.checkBody('userName','User Name is required').notEmpty();
        req.checkBody('mailId', 'Mail_Id is required').isEmail();
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
exports.signout = function(req , res) 
{
    //res.cookie('s_Ts_cookie','', {httpOnly: true });
    res.cookie('s_Ts_cookie', 0,{ Path:'/'});
    //res.cookie('s_Ts_cookie').destroy();
    res.status(200).send({message:"Logout Success","status":"success"});
}

exports.addUserQuestion = function(req, res) {
    var contype = req ? req.headers['content-type'] : "";
    console.log("Question Content type : " + contype);
    if (contype && contype.indexOf('application/json') >= 0) {
        var requestBody = req.checkBody;
        if (requestBody('QuestionId', 'QuestionId is required').notEmpty()) {
            requestBody('QuestionId', 'QuestionId is not valid').isInt();
        }
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
            reqObj.questionId = req.body.QuestionId;
            reqObj.userId = req.body.UserId;
            reqObj.relatedTags = req.body.RelatedTags;
            reqObj.title = req.body.Title;
            reqObj.description = req.body.Description;
            reqObj.postedDate = new Date();
            modelObj.addQuestion(reqObj, res, function(err, result) {
                if (err) {
                    res.status(200).json({ message: 'Failure' });
                } else {
                    res.status(200).json({ message: "Question updated sucessfully", status: 'Success' });
                }
            });
        }
    } else {
        res.status(400).json({ message: 'Bad Request', status: 'Failure' });
    }
}

exports.addUserAnswer = function(req, res) {
    var contype = req ? req.headers['content-type'] : "";
    console.log("Answer Content type : " + contype);
    if (contype && contype.indexOf('application/json') >= 0) {
        var requestBody = req.checkBody;
        if (requestBody('QuestionId', 'QuestionId is required').notEmpty()) {
            requestBody('QuestionId', 'QuestionId is not valid').isInt();
        }
        if (requestBody('AnswerId', 'AnswerId is required').notEmpty()) {
            requestBody('AnswerId', 'AnswerId is not valid').isInt();
        }
        if (requestBody('UserId', 'UserId is required').notEmpty()) {
            requestBody('UserId', 'UserId is not valid').isInt();
        }
        requestBody('Description', 'Description is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            res.send(errors);
        } else {
            var reqObj = {};
            reqObj.questionId = req.body.QuestionId;
            reqObj.answerId = req.body.AnswerId;
            reqObj.userId = req.body.UserId;
            reqObj.description = req.body.Description;
            modelObj.addAnswer(reqObj, res, function(err, result) {
                if (err) {
                    res.status(200).json({ message: 'Failure' });
                } else {
                    res.status(200).json({ message: "Answer updated sucessfully", status: 'Success' });
                }
            });
        }
    } else {
        res.status(400).json({ message: 'Bad Request', status: 'Failure' });
    }
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
               if(result)
               {
                var smtpTransport = nodemailer.createTransport(
                    {  
                        service: 'gmail',  
                        auth: {  
                        user: "riderdinesh2610@gmail.com",  
                        pass: "9976059148"  
                        }  
                    }); 
                const mailOptions = {  
                    to: 'riderdinesh2610@gmail.com',  
                    from: 'passwordreset@demo.com',  
                    subject: 'Node.js Password Reset',  
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +  
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +  
                        'http://' + req.headers.host + '/reset/' + manipulatedReq.token + '\n\n' +  
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'  
                }; 
                smtpTransport.sendMail(mailOptions, function(err) {                 
                    console.log("HI:");  
                    res.json({status : 'success', message : 'An e-mail has been sent to  with further instructions.'});              
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