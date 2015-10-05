// server.js

//services and mongoose start
//var services = require('./config/serviceStart.js');

this.$ = function(){};

this.$.proxy = function(func,obj)
{
    if (typeof(func)!="function")
        return;

    // If obj is empty or another set another object 
    if (!obj) obj=this;

    return function () { return func.apply(obj,arguments); }
};


var tester = require('./app/client_tests/clientTester.js');

var c = new tester.CropTests();

c.init();
c.CropAreaCreated();
c.init();
c.AddMode();
c.init();
c.CancelMode();
c.init();
c.Delete();
c.init();
c.Save();