var express = require('express');
var app = express();
var MCapi = require('mailchimp-api');
var MC = new MCapi.Mailchimp('5584e6a5eaf9776ecd446e37f029bfd9-us2');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var csvWriter = require('csv-write-stream')
var fs = require("fs");
const path = require('path');







app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(5001);


var connection = mysql.createConnection({
  host     : 'lakeviewhomes.cofq1ovlapvc.us-east-1.rds.amazonaws.com',
  user     : 'lakeviewhomes',
  password : 'Dog8Cat%123',
  database : 'breeze'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
});



app.post('/login', function (req, res) {
  var formData = req.body;
  var returnData = '';
  SelectLead(formData.email).then(function(result) {
    res.send(result);
    res.end();
  });
});


app.post('/getPlants', function (req, res) {
  var postData = req.body;
  GetPlants(res,postData.category).then(function(result) {
  });
});



function GetPlants(res, category){
  return new Promise(function (resolve, reject) {
      var result = [];
      var queryString = "SELECT * FROM breeze.Homes WHERE open = '1'";
      if(category != ""){
        queryString += " AND category = '" + category + "'";
      }

      var query = connection.query(queryString);
      query.on('result', function(row) {
        result.push(row);
      }).on('end', function(){
        res.send(result);
        resolve(result);
      });
  });
}


app.post('/getLots', function (req, res) {
  var postData = req.body;
  GetLots(res,postData.home).then(function(result) {
  });
});

function GetLots(res, marketingName){
    return new Promise(function (resolve, reject) {
    var result = [];
    var queryString = "SELECT * FROM breeze.Lots WHERE open = '1' AND marketingName = '" + marketingName + "'";
    var query = connection.query(queryString);
    query.on('result', function(row) {
      result.push(row);
    }).on('end', function(){
      res.send(result);
      resolve(result);
    });
  });
}



app.post('/getHomeInfo', function (req, res) {
  var postData = req.body;
  GetHomeInfo(res,postData.marketingName, postData.elevation).then(function(result) {
  });
});

function GetHomeInfo(res, marketingName, elevation){
    return new Promise(function (resolve, reject) {
    var result = [];
    var queryString = "SELECT * FROM breeze.Homes WHERE open = '1' AND marketingName = '" + marketingName + "' AND elevation = '" + elevation +"'";

    var query = connection.query(queryString);
    query.on('result', function(row) {
      result.push(row);
    }).on('end', function(){
      res.send(result);
      resolve(result);
    });
  });
}
