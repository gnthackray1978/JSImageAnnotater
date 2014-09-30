var mongoose = require('mongoose');

var cats = new mongoose.Schema({
	 // _id: Schema.Types.Mixed
	  setId: { type: Number},
	  description: { type: String} 
});

var ques = new mongoose.Schema({
	  category: { type: Number, trim: true},
	  question: { type: String, trim: true},
	  type: { type: String, trim: true},
	  answers: { type : Array , "default" : []}
});




var settings  = {
	'url' : 'mongodb://georgequestions:george1978@ds049868.mongolab.com:49868/questions'	
};

module.exports.settings = settings;

module.exports.ques = ques;

module.exports.cats = cats;

