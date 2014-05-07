//Bing API search functions

var request = require('request')
	, qs = require('qs'));

var bing_key = require("./config.js").bing_key;

//There is probably a better naming scheme than this, but i don't know it.
var base_url = "https://api.datamarket.azure.com/Bing/Search";
var auth = new Buffer(bing_key + ":" + bing_key).toString('base64');

module.exports = {
	search: function(query, service_op, result_fmt) {
		result_fmt = result_fmt || "json"; //Default format is json.
		query = encodeURIComponent( "'" + query + "'").replace(/'/g, "%27");

		request_url = base_url + "/" + service_op + "?$format=" + result_fmt +
					  "&Query=" + query ;

		var options = {
			url: request_url,
			headers: {
				"Authorization" : "Basic " + auth
			}
		};
		console.log("Sending request for: " + request_url);
		request(options, this.process_results);
	},

	process_results: function(error, response, body) {
		if(!error && response.statusCode == 200) {
			console.log("Success");
			console.log(body);
			image_list = body;

		} else {
			console.log("Error code: " + response.statusCode);
			console.log("Body of Error: " + body);
		}
	}
};