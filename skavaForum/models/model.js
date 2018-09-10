var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var url = "mongodb://dinesh:dineshit8@ds151382.mlab.com:51382/forum";
var dbo;

//create mongoDB and collection 

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("forum");
    dbo.createCollection("userinfo", function(err, res) {
      if (err) throw err;
      console.log("Userinfo Collection Created..!");
      db.close();
    });
  });

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("forum");
    dbo.createCollection("questions", function(err, res) {
      if (err) throw err;
      console.log("Questions Collection Created..!");
      db.close();
    });
});

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("forum");
    dbo.createCollection("answers", function(err, res) {
      if (err) throw err;
      console.log("Answers Collection Created..!");
      db.close();
    });
});

exports.addUser = function(req, res, cbk) 
{
    MongoClient.connect(url, function (err, db) {
        if(err) throw err;
        dbo = db.db("forum");
        dbo.collection('userinfo').insert(req, function (err, result) {
            if(result)
            {
                cbk(false,result);
            }
            else
            {
                cbk(true);
            }
        });
        db.close();
    });
}

exports.getuser = function(req, res, cbk) 
{
    MongoClient.connect(url, function (err, db) {
        if(err) throw err;
        dbo = db.db("forum");
        const cursor = dbo.collection('userinfo').find({mailId : req.mailId}).toArray(function(err,results)
        {
            var userProfile = results;
            if(userProfile.length && userProfile[0])
            {
                cbk(false,userProfile[0]);
            }
            else
            {
                cbk("User profile not found.")
            }
        });
        db.close();
    });
}

exports.addQuestion = function(reqObj, res, cbk) {
    MongoClient.connect(url, function (err, db) {
        if(err) throw err;
        dbo = db.db("forum");
        dbo.collection('questions').update({
            $and: [
                { questionId: reqObj.questionId },
                { userId: reqObj.userId }
            ]
        }, reqObj, { upsert: true }, function(err, result) {
            cbk(null, result);
        });
        db.close();
    });
}

exports.addAnswer = function(reqObj, res, cbk) 
{
    var ansDescriptionObj = {};
    ansDescriptionObj.answerId = parseFloat(reqObj.answerId);
    ansDescriptionObj.questionId = parseFloat(reqObj.questionId);
    ansDescriptionObj.userId = reqObj.userId;
    ansDescriptionObj.description = reqObj.description;
    ansDescriptionObj.postedDate = new Date();
    ansDescriptionObj.userName = reqObj.userName;
    MongoClient.connect(url, function (err, db) {
    if(err) throw err;
    dbo = db.db("forum");
    dbo.collection('answers').find({ questionId: ansDescriptionObj.questionId}, { projection: { _id: 0 } }).toArray(function(err, results) 
    {
        if (results.length) {
            MongoClient.connect(url, function (err, db) {
            if(err) throw err;
            dbo = db.db("forum");
            dbo.collection('answers').find({
                $and: [{ questionId: reqObj.questionId }, {
                    answerDescription: {
                        $elemMatch: {
                            $and: [{ answerId: ansDescriptionObj.answerId }, { userId: ansDescriptionObj.userId }]
                        }
                    }
                }]
            }).toArray(function(err, results) {
                console.log(results);
                if (results && results.length) {
                    console.log("update array of object");
                    MongoClient.connect(url, function (err, db) {
                    if(err) throw err;
                    dbo = db.db("forum");
                    dbo.collection('answers').updateOne({
                        $and: [{ questionId: reqObj.questionId }, {
                            answerDescription: {
                                $elemMatch: {
                                    $and: [{ answerId: ansDescriptionObj.answerId }, { userId: ansDescriptionObj.userId }]
                                }
                            }
                        }]
                    }, { $set: { 'answerDescription.$': ansDescriptionObj } }, function(err, result) {
                        cbk(null, result);
                    })
                });
                } else {
                    console.log("push");
                    MongoClient.connect(url, function (err, db) {
                    if(err) throw err;
                    dbo = db.db("forum");
                        dbo.collection('answers').update({ questionId: reqObj.questionId }, { $push: { "answerDescription": ansDescriptionObj } }, function(err, result) {
                            cbk(null, result);
                        });
                    });
                }
            });
            });
            } 
            else 
            {
            var newQuesObj = {};
            newQuesObj.questionId = reqObj.questionId;
            newQuesObj.answerDescription = [];
            newQuesObj.answerDescription.push(ansDescriptionObj);
            console.log("new");
            MongoClient.connect(url, function (err, db) {
            if(err) throw err;
            dbo = db.db("forum");
                dbo.collection('answers').insert(newQuesObj, function(err, result) {
                    if(err)
                    {
                        throw err;
                    }
                    else
                    {
                        cbk(null, result);
                    }
                });
                db.close();
            });
            }
        });
        db.close();
    });
}
exports.getAnswerByQuesId = function(req, res, cbk) 
{
    var query = { "questionId": req.body.QuestionId };
    MongoClient.connect(url, function (err, db) {
        if(err) throw err;
        dbo = db.db("forum");
        dbo.collection('answers').find(query, { projection: { _id: 0 } }).toArray(function(err, result) {
            cbk(null, result);
        });
        dbo.close();
    });
}
exports.forgotPwd = function(req, res, cbk) 
{
    MongoClient.connect(url, function (err, db) {
        if(err) throw err;
        dbo = db.db("forum");
        const cursor = dbo.collection('userinfo').find({mailId : req.mailId}).toArray(function(err,results)
        {
            var userProfile = results;
            if(userProfile.length && userProfile[0])
            {
                //cbk(false,userProfile[0]);
                var myquery = { mailId:userProfile[0].mailId };  
                    var newvalues = { $set: {resetPasswordToken: req.token, resetPasswordExpires: Date.now() + 3600000 }};  
                    dbo.collection("userinfo").updateOne(myquery, newvalues, function(err, res) {  
                        if (err) throw err;  
                        console.log("1 document updated");  
                    });  
                    cbk(false,userProfile[0]);
            }
            else
            {
                cbk("Email Id Not Exists !")
            }
        });
    });
} 

exports.getRelatedQuest = function(req, res, cbk) {
    var searchTerm = req.body.keyWords;
    var limit = req.body.limit ? req.body.limit : 5;
    var pageNumber = req.body.pageNumber ? req.body.pageNumber : 1;
    MongoClient.connect(url, function (err, db) {
        if(err) throw err;
        dbo = db.db("forum");
        dbo.collection("questions").createIndex({
        title: "text"
        }, function(err, indexName) {
        if(err) {
            console.log("Error while indexing..");
        }
        else {
            console.log(indexName);
        }
        });
        dbo.collection('questions')
        .find({$text: {$search: searchTerm}}, {score: {$meta: "textScore"}})
        .sort({score: {$meta: "textScore"}})
        .project({ score: { $meta: "textScore" } })
        .limit(limit)
        .skip((pageNumber - 1) * limit)
        .toArray(function(err, result){
        if(err) {
            console.log("Somthing went wrong");
            cbk(err);
        }
        else {
            console.log(result);
            cbk(null, result);
        }
        });
        db.close();
    });
}

exports.resetPassword = function(req, res , cbk)
{
    MongoClient.connect(url, function (err, db) {
        if(err) throw err;
        dbo = db.db("forum");
        const cursor = dbo.collection('userinfo').findOne({resetPasswordToken : req.params.token , resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {  
            if (!user) {  
                res.json({message: 'Password reset token is invalid or has expired.'});  
            }
            else
            {
                cbk(false,user);
            }
        });
    });
}
exports.updatePaswword = function(req,res,cbk)
{
    MongoClient.connect(url,function(err,db)
    {
        if(err) throw err;
        dbo = db.db("forum");
        dbo.collection('userinfo').findOne({resetPasswordToken: req.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {  
            if (!user) {  
                res.json({message: 'Password reset token is invalid or has expired.'});  
            }  
            var myquery = { resetPasswordToken: req.token };  
            var newvalues = { $set: {passWord: req.passkey,resetPasswordToken: null, resetPasswordExpires: null, modifiedDate : Date(Date.now()) }};  
            dbo.collection('userinfo').updateOne(myquery, newvalues, function(err, result) {  
                if (err) throw err;  
                cbk(false , "success");
            });  
        });
    });
}
exports.getQuestions = function(req,res,cbk)
{
    MongoClient.connect(url , function(err , db)
    {
        if(err) throw err;
        var dbo = db.db("forum");
        dbo.collection('questions').find({}).toArray(function(err, results) 
        {
            if(err) throw err;
            if(results)
            {
                cbk(false,results);
            }
            else
            {
                cbk("No questions found");
            }
        });
    });
}
exports.getQuqAnsById = function(req,res,cbk)
{
    MongoClient.connect(url , function(err , db)
    {
        if(err) throw err;
        var dbo = db.db("forum");
        var questId = parseFloat(req.body.questionId);
        dbo.collection('questions').aggregate([
            {$match : {"questionId" : questId}},
            { 
                $lookup:
                {
                    from: 'answers',
                    localField: 'questionId',
                    foreignField: 'questionId',
                    as: 'answerDetails'
                }
             },
            ]).toArray(function(err, res) {
                if (err) throw err;
                cbk(false,res);
            });
    });
}

exports.getTagsByUserId = function(req,res,cbk)
{
    MongoClient.connect(url , function(err , db)
    {
        if(err) throw err;
        var dbo = db.db("forum");
        const cursor = dbo.collection('userinfo').find({userId : req.session.userId}).project({"tags" : 1 , _id : 0}).toArray(function(err,tags){  
            if (tags.length) {  
                cbk(false,tags);
            }
            else
            {
                cbk("Please Login...");
            }
        });
    });
}