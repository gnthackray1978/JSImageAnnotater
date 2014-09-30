module.exports = function(app,express) {
	
	app.get('/help',  function(req, res) {	 
	
		console.log ('/help hit' );
		
	   res.json('test hit');
	
	});
	 
};

 