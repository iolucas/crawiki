var mongoose = require('mongoose'); //Get mongoose module
var https = require('https');
var Promise = require('promise');
var cheerio = require('cheerio');

console.log("Starting App\n")

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

    //start populating db
    populate(Article)

    /*var newArticle = new Article({ name: 'Article1' });
    newArticle.save(function(err){
        if(err)
            console.log(err)
        else
            console.log("Saved.")
    });*/
});

function populate(Article) {

    getArticleSummaryReferences("MQTT", function(refCollection) {
        console.log(refCollection)

        

    });

}

function getArticleSummaryReferences(articleTitle, callback) {

    httpGet('https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=' + articleTitle)
        .then(function(recData){
            //Pars json data
            var recObj = JSON.parse(recData)

            //Check some error
            if(recObj['error']) {
                //Log error
                console.error("ERROR:" + recObj['error']['code'] + " | " + recObj['error']['info'])
                process.exit(1) //Exit running process return error (code != 0)
            }

            //Get summary html data
            htmlData = recObj['parse']['text']['*']
            
            //Load data on cheerio
            $ = cheerio.load(htmlData);

            var referenceCollection = []

            //Iterate thru all p tags and inner a tags
            $('p').children('a').each(function(i, elem){
                var refLink = $(this).attr('href') //Get href
                referenceCollection.push(refLink)   //push to the ref collection
            });
            
            //Fire the callback function
            callback(referenceCollection)

        }, function(err) {
            console.log(err)
        });
}


function httpGet(url) {

	return new Promise(function (resolve, reject) {
		
		var recData = '';

		https.get(url, function(res) {
  			res.setEncoding('utf8');

			res.on('data', (chunk) => {
				recData += chunk;
			});

			res.on('end', () => {

				resolve(recData);	
			});

			res.on('error', (e) => {
				reject(e);		
			});

		}).on('error', (e) => {
  			reject(e);
		});
	});
}