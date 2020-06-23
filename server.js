//Libraries required for running the app
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

//Require all models from the models folder
var db = require("./models");

var PORT = 8080;
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
    var result = {};
    // get the html body using axios
    axios.get("https://www.nytimes.com/").then(function (response) {

        // load the html body into cheerio
        var $ = cheerio.load(response.data);
        console.log("response received");
        // Get headline, summary and link for each article
        $("article.css-8atqhb").each(function (i, element) {

            result.headline = $(element).find("h2").text();
            result.summary = $(element).find("p").text();
            result.link = $(element).find("a").attr("href");
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
        console.log("The response serverside is: ");
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

    });

});
// when user clicks the submit-note button, the note is attached to the article.


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
