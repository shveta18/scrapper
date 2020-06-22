//Libraries required for running the app
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

//Require all models from the models folder
var db = require("./models");

var PORT = 3000;
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

//ROUTE 1: To scrape the news website and save it to the database when scrape button clicked (app.js)
app.get("/scrape", function (req, res) {
    // get the html body using axios
    axios.get("https://www.nytimes.com/").then(function (response) {
        // load the html body into cheerio
        var $ = cheerio.load(response.data);
        console.log("response received");
        // Get headline, summary and link for each article
        $("article.css-8atqhb").each(function (i, element) {
     //   $("div.css-6p6lnl").each(function (i, element) {
            var result = {};
            // result.headline = $(element).find("h2.css-1cmu9py").text();
            // result.summary = $(element).find("p.css-1pfq5u").text();
            result.headline = $(element).find("h2").text();
            result.summary = $(element).find("p").text();
            result.link = $(element).find("a").attr("href");

            console.log(result);
           // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });
    });

    console.log("The response is:");
    // store the resuls obtained in the db
    // db.Article.create(result);
});


// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
