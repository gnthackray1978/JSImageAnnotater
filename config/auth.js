// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '583027481809843', // your App ID
		'clientSecret' 	: 'f2b24e7e582cecdcbdee48d3197ed340', // your App Secret
		'callbackURL' 	: 'http://local.gnthackray.net:8080/auth/facebook/callback'
	}

};
