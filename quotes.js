var request = require('request');

var base_quote_uri = "http://api.theysaidso.com/";

var quote_key = require('./config').quote_key;

module.exports={
	get_random_quote: function(category, callback) {
		request_uri = base_quote_uri + "qod?category=" + category;
		console.log("Sending request to: " + request_uri);
		request(request_uri, function(error, response, body) {
			if(!error && response.statusCode == 200) {
				console.log("Got the quote!");
				var results = JSON.parse(response.body);
				console.log(results);
				callback(results.contents.quote);
			} else {
				if(response.statusCode == 429) {
					console.log("Accessed API too many times");
				}
				console.log("Failed getting quote");
				throw error;
			}
		});
	}

};