var mongoose = require('mongoose');

var options = new mongoose.Schema({
    LayerId: { type: Number},
    UrlId: { type: Number},
    DefaultFont: { type: String} ,
    DefaultNoteColour: { type: String} ,
    DefaultEditorFontColour: { type: String} ,
    DefaultEditorBorderColour: { type: String} ,
    DefaultNoteFontColour: { type: String} ,
    IsTransparent: { type: Boolean},
    Visible: { type: Boolean}
});

var notes = new mongoose.Schema({
	  Annotation: { type: String} ,
	  Index: { type: Number},
	  UrlId: { type: Number},
	  X: { type: Number} ,
	  Y: { type: Number} ,
	  Width: { type: Number} ,
	  Height: { type: Number} ,
	  D: { type: Number} ,
	  LayerId: { type: Number},//there was some mix up over a field called layer and this layerid ive since removed layer to avoid confusion
	  Visible : { type: Boolean},
	  CropArea : { type: Boolean},
	  IsOpen: { type: Boolean}
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

module.exports.options = options;