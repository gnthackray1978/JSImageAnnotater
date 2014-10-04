// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
 
var http     = require('http');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var configDB = require('./config/database.js');



// configuration ===============================================================
mongoose.connect(configDB.settings.url, function (err, res) {
  if (err) {
	console.log ('ERROR connecting to: ' + configD.settings.url + '. ' + err);
  } else {
	console.log ('Succeeded connected to: ' + configDB.settings.url);
	 
	//console.log(mongoose.connection.db.collection); 
	 
	mongoose.connection.db.collectionNames(function (err, names) {
       // console.log(names); // [{ name: 'dbname.myCollection' }]
		
    });

  }
});
  



app.configure(function() {

	var oneDay = 1

	app.use(express.compress());

	console.log('static contents at: ' + __dirname + '\\client');

	app.use(express.static(__dirname + '/client', { maxAge: oneDay }));
	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	  
	app.use(express.bodyParser());
    app.use(express.methodOverride());
	

	
	
	
	
	 
});

console.log('routing...');

// routes ======================================================================
require('./app/routes.js')(app,express); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);