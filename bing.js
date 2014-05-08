//Bing API search functions

//Authorization info
var bing_key = require("./config.js").bing_key;
var auth = new Buffer([bing_key, bing_key].join(':')).toString('base64');

//Node modules
var request = require('request').defaults({
	headers : {
		'Authorization' : 'Basic ' + auth
	}
});

//There is probably a better naming scheme than this, but i don't know it.
var root_uri = 'https://api.datamarket.azure.com/Bing/Search';

module.exports = {
	search: function(query, service_op, callback) {
		result_fmt = "json"; //DGAF about XML
		query = encodeURIComponent( "'" + query + "'").replace(/'/g, "%27");

		request_uri = root_uri + "/" + service_op + "?Query=" + query +
						"&$top=10&$format=" + result_fmt;

		console.log("Sending request for: " + request_uri);
		request(request_uri, function(error, response, body) {
			if(!error && response.statusCode == 200) {
				console.log("Success");

				var results = JSON.parse(response.body);
				//WHY DOES THIS WORK HERE AND NOT BELOW!!?!!?!
				results = results.d.results[0];
				callback(results);
			} else {
				console.log("Here!!!!");
				console.log("Error code: " + response.statusCode);
				console.log("Error is: " + error);
				console.log("Body of Error: " + body);
			}
		});
	},
	
	//From a given query and service operation, gives the user the first result
	//of their search.
	get_first_result: function(query, service_op, callback) {
		results = this.search(query, service_op, function(results) {
			callback(results);
		});
	}
};