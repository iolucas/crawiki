console.log("App Started")
console.log("")
var https = require('https');
var Promise = require('promise');
var cheerio = require('cheerio');

pageTitle = process.argv[2] || "MQTT"

//implement system that will check if the reverse reference is true to check probability of one direction reference is true

getData('https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=' + pageTitle)
	.then(function(recData){
		var recObj = JSON.parse(recData)

		htmlData = recObj['parse']['text']['*']
		
		$ = cheerio.load(htmlData);

		$('p').children('a').each(function(i, elem){
			console.log($(this).attr('href'))
		});
		

		/*links = $("a").each(function(index, element){
			console.log($(this).attr("href"))

		});*/

		//console.log(links)
		
		/*for (var link in links ) {
			console.log(link.attrib)
		}*/

		/*for (var key in recObj ) {
			console.log(key)
		}*/

    	//console.log()

	}, function(err) {
		console.log(err)
	});

function getData(url) {

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