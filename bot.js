//All The Node-js libs required
var Twit = require('twit');

var request = require('request')
	, fs = require('fs')
	, gm = require('./gm');

var wrestlers = require('./wrestlers.json');

//Constants...probably will make some time_const file that 
//I use in most of my projects like this.
var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

var GOOGLE_API_REQUEST = "https://www.googleapis.com/customsearch/v1?";
var GOOGLE_API_KEY = "";


//Reads my congif
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

	
}

//Try to send a tweet as soon as program is run.
tweetRandomWrestler();

//...and every day after that.
setInterval(tweetRandomWrestler, 1000 * 60 * 60 * 24);