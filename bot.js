//All The Node-js libs required
var Twit = require('twit');

var request = require('request')
	, fs = require('fs')
	, gm = require('gm');

var bing_key = require('./config.js').bing_key;
var wrestlers = require('./wrestlers.json');

var bing = require('./bing.js');

//Constants...probably will make some time_const file that 
//I use in most of my projects like this.
var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

/* Reads my config file.
   This config file has my twitter api access details.
   If you want to run this yourself, you have to create your own config.js file
*/
var T = new Twit(require('./config.js'));


//This takes an image, and tries to tweet it.
function sendTweet(imageFile) {
	//TODO: the way media is might not work. Check to see if it does.
	T.post('statuses/update_with_media', {status: '', media: [imageFile]}, function(error, response) {
			if(response) {
				console.log("Your bot tweeted a new thing");
			}

			if(error) {
				console.log("Your bot had an error:", error);
			}
	});
}


function tweetRandomWrestler() {
	//choose a random wrestler from the array.
	var wrestler = wrestlers.wrestlers[Math.floor(Math.random() * wrestlers.wrestlers.length)];
	bing.search(wrestler, "Image", function(result) {
		var mime_map = require('./mimeTypesToFileExt.json');
		var file_ext = mime_map.mimeTypesToFileExt[result.ContentType];
		var file_name = wrestler + "." + file_ext;
		request(result.MediaUrl).pipe(fs.createWriteStream(file_name));
	});
	
}

//Try to send a tweet as soon as program is run.
tweetRandomWrestler();

//...and every day after that.
//setInterval(tweetRandomWrestler, 1000 * 60 * 60 * 24);