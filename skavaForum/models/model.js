var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var url = "mongodb://localhost:27017/";
var dbo;

//create mongoDB and collection 
MongoClient.connect(url, function (err, db) {
  dbo = db.db("forum");
  dbo.createCollection("userinfo", function (err, res) {
      if(err) throw err;
    console.log("Userinfo Collection Created..!");
  });
  dbo.createCollection("questions", function (err, res) {
    console.log("questions Collection Created..!");
  });
  dbo.createCollection("answers", function (err, res) {
    console.log("answers Collection Created..!");
  });
  db.close();
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
    ansDescriptionObj.answerId = reqObj.answerId;
    ansDescriptionObj.userId = reqObj.userId;
    ansDescriptionObj.description = reqObj.description;
    ansDescriptionObj.postedDate = new Date();
    MongoClient.connect(url, function (err, db) {
    if(err) throw err;
    dbo = db.db("forum");
    dbo.collection('answers').find({ questionId: reqObj.questionId }, { projection: { _id: 0 } }).toArray(function(err, results) 
    {
        if (results.length) {
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
                if (results.length) {
                    console.log("update array of object");
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
                } else {
                    console.log("push")
                    dbo.collection('answers').update({ questionId: reqObj.questionId }, { $push: { "answerDescription": ansDescriptionObj } }, function(err, result) {
                        cbk(null, result);
                    });
                }
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