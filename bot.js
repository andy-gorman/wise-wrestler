//All The Node-js libs required
var Twit = require('twit');

var request = require('request')
	, fs = require('fs')
	, gm = require('gm')
	, easyimage = require('easyimage');

var bing_key = require('./config.js').bing_key;
var wrestlers = require('./wrestlers.json');

var bing = require('./bing.js');
var quotes = require('./quotes.js');

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
	var query = wrestler + " wrestler"; //Increases chance we won't get 
										//an image I don't want.
	bing.get_random_result(query, "Image", 100, function(result) {

		var mime_map = require('./mimeTypesToFileExt.json');
		var file_ext = mime_map.mimeTypesToFileExt[result.ContentType];
		var file_name = ("./img/" + wrestler + "." + file_ext).replace(/ /g, '_');

		var dl = request(result.MediaUrl).pipe(fs.createWriteStream(file_name));

		//Wait for the download to finish piping to a file, then manipulate
		//the image.
		dl.on('finish', function () {
			var img_dim = {};
			gm(file_name).size(function(err, size) {
				if(!err) {
					
					var file_name_esc = file_name.replace(/'/g, "\\'");
					quotes.get_random_quote("inspire", function(quote) {
						var full_quote = quote + "\n-" + wrestler;
						//First part of the command to create the caption.
						var textImg = "convert -background '#0008' -fill white \\\n" +
								"-font Helvetica -pointsize 36 -size "+ size.width + "x \\\n" +
								"caption:'" + full_quote + "' \\\n";
						var cmd = textImg + file_name +
							" +swap -gravity south -composite " + file_name;
						console.log("Execing cmd: " + cmd);

						easyimage.exec(cmd, function(err, stdout, stderr) {
							if (err) throw err;
							console.log("executed command");
							sendTweet(file_name);
						});

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