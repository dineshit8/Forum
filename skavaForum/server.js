var express = require('express');
var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
var routes = require("./routes/routes.js");
var cookieParser = require('cookie-parser'); 
const expressValidator = require('express-validator');
var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
routes(app);

var server = app.listen(4000, function () {
  console.log("app running on port.", server.address().port);
});
