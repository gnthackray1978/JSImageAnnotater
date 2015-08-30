// server.js

//services and mongoose start
//var services = require('./config/serviceStart.js');



var tester = require('./app/client_tests/clientTester.js');

var c = new tester.cc('bannana');

c.init();