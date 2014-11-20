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
		
	notes.get('/document/', function(req, res, next) {
		// doing more stuff	
		console.log ('/document get' );
		
		var db = req.NotesModel;	
		
	// 	var catid = req.param("note");
		
		db.find({}).exec(function(err, result) {
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


	// call our router we just created
	app.use('/notes', notes);
	

};