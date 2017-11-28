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

app.use(express.static(path.join(__dirname, '../build')));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(5002);


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

app.get('/SelectLeads', function (req, res) {
  SelectLeads(res).then(function(result) {
  });
});


app.post('/getHomes', function (req, res) {
  var postData = req.body;
  GetHomes(res,postData.category).then(function(result) {
  });
});

function GetHomes(res, category){
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



app.post('/mailchimp', function (req, res) {
  var formData = req.body;
  var nameParts = ['', ''];
  if(formData.full_name!==undefined){
    nameParts = formData.full_name.split(' ');
  }
  var userData = {
    FNAME: nameParts[0],
    LNAME: nameParts[1],
    EMAIL: formData.email,
    PHONE: formData.phone.replace(/-/g, ''),
    REFERRER: formData.referrer,
    CAMPAIGN: formData.utm_campaign,
    SOURCE: formData.utm_source,
    MEDIUM: formData.utm_medium
  };

  InsertLead(userData).then(function(result) {/**console.log(result);**/});

  MC.lists.subscribe({id: 'f15643f098', email:{email: formData.email},
   merge_vars: userData, double_optin: false }, function(data) {
    res.send(data);
    res.end();
  }, function(error) {
    res.send('error');
    res.end();
  });

});


app.use(function(req, res) {
    res.status(404).send('Sorry cant find that!');
});

function InsertLead(data){
    return new Promise(function (resolve, reject) {
    var result;
    var timestamp = new Date();

    var query = connection.query("INSERT INTO breeze.Leads\
     (`first_name`, `last_name`, `email`, `phone`, `utm_source`, `utm_medium`, `utm_campaign`, `referrer`, `Timestamp`) VALUES \
     ('"+data.FNAME+"','"+data.LNAME+"','"+data.EMAIL+"','"+data.PHONE+"','"+data.SOURCE+"','"+data.MEDIUM+"','"+data.CAMPAIGN+"','"+data.REFERRER+"', '"+timestamp+"')");
    query.on('result', function(row) {
      result = row;
    }).on('end', function(){
      resolve(result);
    });
  });
}

function SelectLeads(res){
    return new Promise(function (resolve, reject) {
    var result = [];
    var writer = csvWriter()
    writer.pipe(fs.createWriteStream('public/out.csv'));
    var query = connection.query("SELECT `Email`, `first_name`, `last_name`, `phone`, `Timestamp`, `utm_source`, `utm_medium`, `utm_campaign`, `referrer` FROM breeze.Leads ");
    query.on('result', function(row) {
      result.push(row);
      writer.write(row)
    }).on('end', function(){
      writer.end();
      res.send(result);
      resolve(result);
    });
  });
}

function SelectLead(email){
  return new Promise(function (resolve, reject) {
    var exists = false;
    var query = connection.query("SELECT * FROM `breeze`.`Leads` WHERE `email`='"+email+"'");
    query.on('result', function(row) {
      exists = true;
    }).on('end', function(){
      resolve(exists);
    });
  });
}
