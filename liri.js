require("dotenv").config();
var axios = require("./node_modules/axios/lib/axios.js");
var dt= require("./node_modules/moment/moment.js");
var keys = require("./keys.js");
//var request = require('request');
//var bandsintown = require('bandsintown')("codingbootcamp");
var Spotify = require('node-spotify-api');
var fs = require('fs');
var input = process.argv;
var action = input[2];
var inputs = input[3];

switch(action) {
    case "concert-this":
    bands(inputs);
    break;

    case "spotify-this-song":
    spotify(inputs);
    break;

    case "movie-this":
    movie(inputs);
    break;

    case "do-what-it-says":
    doit();
    break;
};


function bands(inputs) {
    var queryURL = 'https://rest.bandsintown.com/artists/' + inputs + '/events?app_id=codingbootcamp';
   axios.get(queryURL)
  .then(function (response) {
    //console.log(response.data);
    console.log(response.data[0].venue.name);
    console.log(response.data[0].venue.city);
    console.log(response.data[0].venue.region);
    console.log(response.data[0].venue.country);
    var temp_date = response.data[0].datetime.substr(0,10);
    const parsed_date = dt(temp_date, 'YYYY-MM-DD').format('MM/DD/YYYY');
    console.log(parsed_date);

    writetofile(response.data[0].venue.name);
    writetofile(response.data[0].venue.city);
    writetofile(response.data[0].venue.region);
    writetofile(response.data[0].venue.country);
    writetofile(parsed_date);
    writetofile("\n");  

  })
  .catch(function (error) {
    console.log(error);
  });

  
    }
                    
            
            

function spotify(inputs) {
    console.log(inputs);
    var spotify = new Spotify({
        id: 'b7f9969940f542ab841a10c98491754b',
        secret: 'e0b55e6d746046f4ac99f38820e6605c'
    });
    
    if(inputs==undefined)
    {
        inputs = "The Sign";
        spotify.search({ type: 'track', query: inputs }, function(err, data) {
            ///['[console.log(data.tracks.items);
            var songInfo = data.tracks.items[15];
            var songResult = console.log("Artist(s): " + songInfo.artists[0].name);
                             console.log("Song Name: " + songInfo.name);
                             console.log("Album: " + songInfo.album.name);
                             console.log("Preview Link: " + songInfo.preview_url);
            
                             writetofile("Artist(s): " + songInfo.artists[0].name);
                             writetofile("Song Name: " + songInfo.name);
                             writetofile("Album: " + songInfo.album.name);
                             writetofile("Preview Link: " + songInfo.preview_url);
                             writetofile("\n");  
                             
         })
    }
    else
    { 
        spotify.search({ type: 'track', query: inputs }, function(err, data) {
            var songInfo = data.tracks.items[0];
            var songResult = console.log("Artist(s): " + songInfo.artists[0].name);
                             console.log("Song Name: " + songInfo.name);
                             console.log("Album: " + songInfo.album.name);
                             console.log("Preview Link: " + songInfo.preview_url);
            
                             writetofile("Artist(s): " + songInfo.artists[0].name);
                             writetofile("Song Name: " + songInfo.name);
                             writetofile("Album: " + songInfo.album.name);
                             writetofile("Preview Link: " + songInfo.preview_url);
                             writetofile("\n");                         
        
        });
    }    
}

function movie(inputs) {
    var queryURL = 'http://www.omdbapi.com/?t=' + inputs + '&apikey=trilogy';
    axios.get(queryURL)
    .then(function(response) {
        if(!inputs) {
            console.log("Title: Mr. Nobody");
            console.log("Release Year: 2009");
            console.log("IMDB Rating: 7.8");
            console.log("Rotten Tomatoes Rating: 67%")
            console.log("Country: Belgium, Germany, Canada, France, USA, UK");
            console.log("Language: English, Mohawk");
            console.log("Plot: A boy stands on a station platform as a train is about to leave. Should he go with his mother or stay with his father? Infinite possibilities arise from this decision. As long as he doesn't choose, anything is possible.");
            console.log("Actors: Jared Leto, Sarah Polley, Diane Kruger, Linh Dan Pham");

            writetofile("Title: Mr. Nobody");
            writetofile("Release Year: 2009");
            writetofile("IMDB Rating: 7.8");
            writetofile("Rotten Tomatoes Rating: 67%")
            writetofile("Country: Belgium, Germany, Canada, France, USA, UK");
            writetofile("Language: English, Mohawk");
            writetofile("Plot: A boy stands on a station platform as a train is about to leave. Should he go with his mother or stay with his father? Infinite possibilities arise from this decision. As long as he doesn't choose, anything is possible.");
            writetofile("Actors: Jared Leto, Sarah Polley, Diane Kruger, Linh Dan Pham");  
            writetofile("\n");         
        }
        else {
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Released);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value)
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);

            writetofile("Title: " + response.data.Title);
            writetofile("Release Year: " + response.data.Released);
            writetofile("IMDB Rating: " + response.data.imdbRating);
            writetofile("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value)
            writetofile("Country: " + response.data.Country);
            writetofile("Language: " + response.data.Language);
            writetofile("Plot: " + response.data.Plot);
            writetofile("\n");

        }
        
    })
    .catch(function(error) {
        console.log(error);
    })
}


function doit() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if(error) {
            return console.log(error);
        }
        var dataArr = data.split(",");  
        if(dataArr[0] === "spotify-this-song") {
            var songcheck = dataArr[1].slice(1, -1);
            spotify(songcheck);
        }
        else if(dataArr[0] === "concert-this") {
            var bandName = dataArr[1].slice(1, -1);
            bands(bandName);
        }
        else if(dataArr[0] === "movie-this") {
            var movieName = dataArr[1].slice(1, -1);
            movie(movieName);
        }
    });
};

function writetofile(data){

const fs = require('fs')

fs.appendFile('log.txt', data + "\n", (err) => { 
    
    if (err) throw err; 
})
}
