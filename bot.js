//All The Node-js libs required
var Twit = require('twit');

var request = require('request')
	, fs = require('fs')
	, gm = require('gm');

var bing_key = require('./config.js').bing_key;
var wrestlers = require('./wrestlers.json');

var bing = require('./bing.js');

//Constants specific to this operation.
var max_dim = 1000; //TODO: Find a good size that looks good.

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
		var file_name = "./img/" + wrestler + "." + file_ext;

		var dl = request(result.MediaUrl).pipe(fs.createWriteStream(file_name));

		//Wait for the download to finish piping to a file, then manipulate
		//the image.
		dl.on('finish', function () {
			var img_dim = {};
			gm(file_name).size(function(err, size) {
				if(!err) {
					
					//Make sure the picture conforms to the arbitrary 
					//Standard I've set.
					var largest_dim = Math.max(size.width, size.height);
					if(largest_dim > max_dim) {
						gm(file_name).minify(largest_dim / max_dim)
						.write(file_name, function(err) {
							if(err) {
								console.log("Couldn't minify the image");
							}
						});
					}

					//Write in given font a random inspirational quote
					//on the image.
					gm(file_name)
					.font("Arial Black.ttf")
					.fontSize(32)
					.drawText(30, 200, "The only person you are destined to become is the person you decide to be.")
					.write(file_name, function(err) {
						if(!err) {
							console.log("Successfully performed operation to image");
						} else {
							console.log("Something went wrong while manipulating the image");
						}
					});
				} else {
					console.log("There Was an error getting the image dimensions");
				}
			});
		});
	});
	
}

//Try to send a tweet as soon as program is run.
tweetRandomWrestler();

//...and every day after that.
//setInterval(tweetRandomWrestler, 1000 * 60 * 60 * 24);