var mongoose = require('mongoose'); //Get mongoose module
var wikipediaDataApi = require("./wikipediaDataApi.js")

console.log("----- Populate Links -----\n")

var page = process.argv[2];
var lang = process.argv[3] || "en";

if(!page) {
    console.error("No page specified.");
    process.exit(1);
}

//console.log(page + " | " + lang);
//process.exit(0);


mongoose.connect('mongodb://localhost/crawikidb');  //Connect to the database
console.log("Connecting to database...")

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function() {
    console.log("Database connected")

    var articleSchema = mongoose.Schema({
        name: String,
        lang: String,
        summaryReferences: [String]
    });

    //Create a model from the schema
    var Article = mongoose.model('Article', articleSchema);

    wikipediaDataApi.getPageAbstractLinks(page, lang).then(function(links) {
        var newArticle = new Article({ 
            name: page,
            lang: lang,
            summaryReferences: links   
        });

        newArticle.save(function(err){
            if(err)
                console.log(err);
            else
                console.log("Saved links from " + page);
        });

    }, function(err) {
        console.log(err);
    });

});

