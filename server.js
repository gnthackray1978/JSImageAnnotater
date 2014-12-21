// server.js

// set up ======================================================================
// get all the tools we need
var http     = require('http');

var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var app            = express();
var request        = require('request');

var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var configDB = require('./config/database.js');



// configuration ===============================================================
mongoose.connect(configDB.settings.url, function (err, res) {
  if (err) {
	console.log ('ERROR connecting to: ' + configDB.settings.url + '. ' + err);
  } else {
	console.log ('Succeeded connected to: ' + configDB.settings.url);
	 
	//console.log(mongoose.connection.db.collection); 
	 
	mongoose.connection.db.collectionNames(function (err, names) {
       // console.log(names); // [{ name: 'dbname.myCollection' }]
		
    });

  }
});
  

 
var oneDay = 1;

// set up our express application

console.log('static contents at: ' + __dirname + '\\client');
app.use(express.static(__dirname + '/client', { maxAge: oneDay }));
app.use(morgan('dev')); 											// log every request to the console
app.use(bodyParser.json());
app.use(methodOverride()); 											// simulate DELETE and PUT 
 
 
// Make our db accessible to our router

app.use(function(req,res,next){
    console.log('Time: %d', Date.now());
	req.NotesModel = mongoose.model('notes', configDB.notes);
 	req.UrlsModel = mongoose.model('urls', configDB.urls);
 	req.OptionsModel = mongoose.model('options', configDB.options);
	next();
});


console.log('routing...');




// routes ======================================================================
require('./app/routes.js')(app,express,request); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);