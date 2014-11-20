var mongoose = require('mongoose');

var notes = new mongoose.Schema({
	  urlId: { type: Number},
	  X: { type: Number} ,
	  Y: { type: Number} ,
	  Width: { type: Number} ,
	  Height: { type: Number} ,
	  Note: { type: String} ,
	  Level: { type: Number}
});

var urls = new mongoose.Schema({
  	urlId: { type: Number},
  	url: { type: String} ,
  	urlName: { type: String} ,
  	urlDescription: { type: String} ,
  	urlGroup: { type: String},
    urlDefault : { type: Boolean}
});

var settings  = {
	'url' : 'mongodb://georgeannotations:george1978@ds041140.mongolab.com:41140/annotations'	
};

module.exports.settings = settings;

module.exports.notes = notes;

module.exports.urls = urls;