//All The Node-js libs required
var request = require('request')
	, fs = require('fs')
	, gm = require('gm')
	, easyimage = require('easyimage');

//API keys
var keys = require('./config.js');

//Data files
var wrestlers = require('./wrestlers.json');

//My files for using different apis.
var bing = require('./bing.js');
var quotes = require('./quotes.js');

//Constants...probably will make some time_const file that 
//I use in most of my projects like this.
var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;


//This takes an image, and tries to tweet it.
function sendTweet(image_file) {
	fs.readFile(image_file, function(err, image_data) {
		var base64_img = new Buffer(image_data, 'base64');
		var r = request.post({
			url: "https://api.twitter.com/1.1/statuses/update_with_media.json",
			oauth: {
				consumer_key: keys.consumer_key,
				consumer_secret: keys.consumer_secret,
				token: keys.access_token,
				token_secret: keys.access_token_secret
			},

		}, function(err, response, body) {
			return console.log(err, body);
		});
		var form = r.form();
		form.append('status', '');
		form.append('media[]', base64_img);
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
						//var full_quote = "This is a placeholder quote";
						var full_quote = quote + "\n-" + wrestler;
						//First part of the command to create the caption.
						var textImg = "convert -background '#0008' -fill white \\\n" +
								"-font Helvetica -pointsize 36 -size "+ size.width + "x \\\n" +
								"caption:\"" + full_quote + "\" \\\n";
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