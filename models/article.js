//create the database to store the articles

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticlesSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }, 
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

//Creates model based on the above schema using mongoose's models

var Article = mongoose.model("Article", ArticlesSchema);

module.exports = Article;