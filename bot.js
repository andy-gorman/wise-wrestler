var Twit = require('twit');


var T = new Twit(require('./config.js'));
var request = require('request');
var wrestlers = require('./wrestlers.json');

var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

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