module.exports = function(app,express,request) {
	
	var notes = express.Router();

	notes.post('/urls/', function(req, res, next) {
        	// stuff stuff stuff
		try
		{
		
		
			var respFunc = function(message, succeeded, id){
				var _resp= {};
				console.log(message)
				_resp= { 
					"success":succeeded,
					"urlId": id
				};
				
				res.contentType('json');
				res.send(_resp);
			};
		
			//console.log(JSON.stringify(req.body, null, 2));
		
		
		    var isNumber  = isNaN(req.body.urlId);
		    
		    console.log(' post ' +  isNumber + ' '+ req.body.urlId);
		    
		    if(isNumber && req.body.urlId == -1) isNumber = false;
		    
		    
		    
			if(!isNumber)
			{
			  //insert
				
			  var tot_records = req.UrlsModel.find({}).count(function (err, count) {
				  
					console.log(count + ' records');
	
					var urlDb = new req.UrlsModel({
						urlId: count +1,
						url: req.body.url,
						urlName: req.body.urlName,
						urlDescription: '' ,
						urlGroup: req.body.urlGroup,
						urlDefault: req.body.urlDefault,
					});
	
					urlDb.save(function (err) {
							if (!err) {
							    respFunc("created", true,count +1);
							} else {
								respFunc(err, false,count +1);
							}
	
					});
				});
			}
			else
			{
				//update
				var _id = Number(req.body.urlId);
			
				req.UrlsModel.findOne({urlId : _id}, function(err,obj) { 
					 
				  obj.url= req.body.url;
				  obj.urlNam= req.body.urlName;
				  obj.urlGroup=req.body.urlGroup;
				  obj.urlDefault=req.body.urlDefault;
					
				  req.urls.save(function (err) {
				  	
				  	if (!err) {
				  		respFunc("created", true,_id);
					} else {
						respFunc(err, false,_id);
					}
				  });

				});
			}
			
		}
		catch (e) {
			console.log(e);	
		}
	//	res.json({ message: 'hooray! welcome to our post!' });	
	
		
	//	next();
	});
		
	notes.get('/urls/', function(req, res, next) {
		// doing more stuff	
		console.log ('/urls get' );
		
			var db = req.UrlsModel;	
		
	 	var urlId = req.param("urlid");
		
		console.log (urlId);
		
		db.find({}).sort({urlDefault: -1}).exec(function(err, result) {
			  if (!err) {
				// handle result
				console.log (result);		
				res.json(result);		
			  } else {
				console.log (err);
			  };
			});	
	});
	
    notes.get('/urls/:url_filter', function(req, res, next) {
		// doing more stuff	
		console.log ('/urls/filter/ get' );
		
		var db = req.UrlsModel;	
		
	 	var urlFilter = req.param("url_filter");
		
		console.log (urlFilter);
		
		db.find({'urlName': new RegExp(urlFilter, "i")}).exec(function(err, result) {
			  if (!err) {
				// handle result
				console.log (result);		
				res.json(result);		
			  } else {
				console.log (err);
			  };
			});	
	});
	
	notes.get('/urls/urlid/:url_Id', function(req, res, next) {
		var db = req.UrlsModel;
		console.log ('/urls/urlid/ get' );
		var _id = Number(req.params.url_Id);

		db.findOne({urlId : _id}, function(err,obj) { 
			
			if (err) 
				res.send(err);
			
			res.json(obj);
			
		});
	});
  
	notes.get('/file/:url_Id', function(req, res, next) {
		// doing more stuff	
		console.log ('/file get' );
		var db = req.UrlsModel;
		
 	//	res.sendFile('topleft1.JPG', { root:  '/home/ubuntu/workspace/resources/' });
 		//1739_Hannah!Thackwray_Birth.JPG
 		//topleft1.jpg
 		
 		var _id = Number(req.params.url_Id);
 		
 		db.findOne({urlId : _id}, function(err,obj) { 
		 
			console.log ('found data: ' + obj.url );
			
			
			if(obj.url != '' && obj.url.indexOf('http') >=0)
			{
				request.get(obj.url)
				.on('response', function(response) {
				    console.log(response.statusCode); // 200
				    console.log(response.headers['content-type']); // 'image/png'
				  }).pipe(res);  // res being Express response
			}
			else
			{
				res.statusCode = 404;
    			return res.send('Error 404: Invalid url');
			}
		});
 		
 	//	var url = 'http://www.gnthackray.co.uk/images/lawsuits/1739_Hannah!Thackwray_Birth.JPG';
 

	});


	// annotations
	
	notes.get('/:url_Id', function(req, res, next) {
		// doing more stuff	
		console.log ('/ get' );
		
		var db = req.NotesModel;	
		
	 	var urlId = Number(req.params.url_Id);
		
		db.find({Visible : true, UrlId : urlId}).exec(function(err, result) {
			  if (!err) {
				// handle result
				console.log (result);		
				res.json(result);		
			  } else {
				console.log (err);
			  };
			});
		
	//	res.json({ message: 'document! welcome to our api!' });	
	});
	
	notes.post('/annotation/', function(req, res, next) {
	    	// stuff stuff stuff
		try
		{
			var respFunc = function(message, succeeded, id){
				var _resp= {};
				console.log(message)
				_resp= { 
					"success":succeeded,
					"urlId": id
				};
				
				res.contentType('json');
				res.send(_resp);
			};
		
		    var _id = req.body.Index;
		    
		    if(!req.body.Index || isNaN(req.body.Index)) {
		    	_id =-1;
		    }
	
			req.NotesModel.findOne({Index : _id}, function (err, annotation) {
				  
		  			if(!annotation){
		  				console.log('annotation not found!');
		  				annotation = new req.NotesModel({
											Index: req.body.Index
											});
		  			}
		  			else
		  			{
		  				console.log('annotation found: ' + annotation.Index);
		  			}
		  			
		  			annotation.Annotation = req.body.Annotation;
		  			annotation.UrlId = req.body.UrlId;
					annotation.X = req.body.X;
					annotation.Y = req.body.Y;
					annotation.Width = req.body.Width;
					annotation.Height = req.body.Height;
					annotation.D = req.body.D;
					annotation.Layer = req.body.Layer;
					annotation.Visible = req.body.Visible;
		  			
					annotation.save(function (err) {
						if (!err) {
						    respFunc("created", true, annotation.Index);
						} else {
							respFunc(err, false, annotation.Index);
						}
					});
	
				});
	
		}
		catch (e) {
			console.log(e);	
		}
	//	res.json({ message: 'hooray! welcome to our post!' });	
	
		
	//	next();
	});
	
	
	// options
	
	notes.post('/option/', function(req, res, next) {
				try
		{
			var respFunc = function(message, succeeded, id){
				var _resp= {};
				console.log(message)
				_resp= { 
					"success":succeeded,
					"urlId": id
				};
				
				res.contentType('json');
				res.send(_resp);
			};
		
		    var _id = req.body.UrlId;
		    
		    if(!req.body.UrlId || isNaN(req.body.UrlId)) {
		    	_id =-1;
		    }
	
			req.OptionsModel.findOne({UrlId : _id}, function (err, option) {
				  
		  			if(!option){
		  				console.log('option not found!');
		  				option = new req.OptionsModel({
											UrlId: req.body.UrlId
											});
		  			}
		  			else
		  			{
		  				console.log('option found: ' + option.UrlId);
		  			}
		  			 
					option.LayerId = req.body.LayerId;
					option.DefaultNoteColour = req.body.DefaultNoteColour;
					option.DefaultEditorFontColour = req.body.DefaultEditorFontColour;
					option.DefaultEditorBorderColour = req.body.DefaultEditorBorderColour;
					option.DefaultNoteFontColour = req.body.DefaultNoteFontColour;
					
					option.DefaultFont = req.body.DefaultFont;
			
					option.IsTransparent = req.body.IsTransparent;
					option.Visible = req.body.Visible;
			 
		  			
					option.save(function (err) {
						if (!err) {
						    respFunc("created", true, option.UrlId);
						} else {
							respFunc(err, false, option.UrlId);
						}
					});
	
				});
	
		}
		catch (e) {
			console.log(e);	
		}
	});
	
	notes.get('/option/:url_Id', function(req, res, next) {
		// doing more stuff	
		console.log ('/ get option' );
		
		var db = req.OptionsModel;	

		var _id = Number(req.params.url_Id);
		
		db.find({
			UrlId : _id,
			Visible :true,
			LayerId :0
		}
			).exec(function(err, result) {
			  if (!err) {
				// handle result
				console.log (result);		
				res.json(result);		
			  } else {
				console.log (err);
			  };
			});
		
	//	res.json({ message: 'document! welcome to our api!' });	
	});


	// call our router we just created
	app.use('/notes', notes);
	

};