require("dotenv").config();

var fs = require("fs");
var Spotify = require("node-spotify-api");
var request = require("request");
var Twitter = require("twitter");
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
// var userEntry = process.argv[3];
var userEntry = process.argv.slice(3).join(" ");

//--------------------------------------------------------------------

switch (command) {
    case "spotify-this-song":
        spotifySong(userEntry);
        break;
    case "my-tweets":
        getTweets();
        break;
    case "movie-this":
        getMovie(userEntry);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log(
            "Hello! Welccome to LIRI. I am a Language Interpretation and Recognition Interface. \n\
            Although I am a work in progress, please feel free to utilize my functional commands: \n\
            - 'spotify-this-song' followed by song title will display for you a song title that most similarly matches your search \n\
            - 'my-tweets' will display for you the 20 most recent tweets from the twitter account of user 'atkpoint' \n\
            - 'movie-this' followed by a film title will display for you movie information of one that most similarly matches your search \n\
            - 'do-what-it-says' will run a function from random.txt"
        );
};

//---------------------------------------------------------------------

function spotifySong() {
    if (!userEntry) {
        userEntry = "The Sign Ace of Base";
    }
    spotify.search({
        type: "track",
        query: userEntry
    }, function (error, data) {
        if (error) {
            return console.log("Error: " + error);
        }
        else {
            console.log("-------------------------------------------------");
            console.dir("Song: " + data.tracks.items[0].name);
            console.dir("Artist: " + data.tracks.items[0].album.artists[0].name);
            console.dir("Album: " + data.tracks.items[0].album.name);
            console.dir("Song Preview: " + data.tracks.items[0].preview_url);
            console.log("-------------------------------------------------");
        }
    });
};


function getTweets() {
    var params = { screen_name: "atkpoint", count: 20 };
    client.get("statuses/user_timeline", params, function (error, tweets, response) {
        var result = {};
        if (error) {
            return console.log("Error: " + error);
        }
        if (!error && response.statusCode === 200) {
            for (var i = 0; i < tweets.length; i++) {
                var results = {
                    Tweeted: tweets[i].text,
                    Created: tweets[i].created_at
                }
                console.log(results);
            }
        }
    });
};


function getMovie() {
    if (!userEntry) {
        var movieName = "Mr. Nobody";
        var apiKey = "e9ad5001";
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&plot=short&apikey=" + apiKey;
        request(queryUrl, function (error, response, body) {
            if (error) {
                return console.log("Error: " + error);
            }
            if (!error && response.statusCode === 200) {
                var omdb = JSON.parse(body, null, 2);
                console.log("-------------------------------------------------");
                console.log("Movie Title: " + omdb.Title);
                console.log("Release Year: " + omdb.Year);
                console.log("imdb Rating: " + omdb.imdbRating);
                console.log("Rotten Tomatoes Rating: " + omdb.Ratings[1].Value);
                console.log("Language: " + omdb.Language);
                console.log("Plot: " + omdb.Plot);
                console.log("Actors: " + omdb.Actors);
                console.log("-------------------------------------------------");
            }
        });
    }
    else {
        var movieName = userEntry;
        var apiKey = "e9ad5001";
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&plot=short&apikey=" + apiKey;
        request(queryUrl, function (error, response, body) {
            if (error) {
                return console.log("Error: " + error);
            }
            if (!error && response.statusCode === 200) {
                var omdb = JSON.parse(body, null, 2);
                console.log("-------------------------------------------------");
                console.log("Movie Title: " + omdb.Title);
                console.log("Release Year: " + omdb.Year);
                console.log("imdb Rating: " + omdb.imdbRating);
                console.log("Rotten Tomatoes Rating: " + omdb.Ratings[1].Value);
                console.log("Language: " + omdb.Language);
                console.log("Plot: " + omdb.Plot);
                console.log("Actors: " + omdb.Actors);
                console.log("-------------------------------------------------");
            }
        });
    }
};


function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log("Error: " + error);
        }
        var dataContent = data.trim().split(",");
        // console.log(dataContent);
        userEntry = dataContent[1].substr(1).slice(0, -1);
        // console.log(userEntry);
        spotifySong(userEntry);
    });
}