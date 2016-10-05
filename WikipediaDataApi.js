var https = require('https');
var Promise = require('promise');
var cheerio = require('cheerio');

module.exports = {

    getPageAbstractLinks: function(page, lang) {

        return new Promise(function (resolve, reject) {
            
            //If no page specified, return error
            if(!page)
                reject("ERROR: No page specified.");

            lang = lang || "en";    //If the language was not specified, set en (English)

            var requestUrl = "https://" + lang + ".wikipedia.org/w/api.php?action=parse&redirects&section=0&prop=text&format=json&page=" + page;

            httpsGet(requestUrl).then(function(reqData) {

                //Parse json object that contains only the abstract portion of the page
                var reqObj = JSON.parse(reqData)

                //Check some error
                if(reqObj['error']) {
                    //Throw reject error
                    reject("ERROR:" + reqObj['error']['code'] + " | " + reqObj['error']['info']);
                }

                //Get the abstract html data
		        htmlData = reqObj['parse']['text']['*']
		
                //Load it on cheerio (jQuery like module)
		        $ = cheerio.load(htmlData);

                var links = []

                //Get all the links on the abstract (<p> tags) and put them into the links array
		        $('p').children('a').each(function(i, elem){
                    links.push($(this).attr('href'))
		        });

                //Resolve request with links array
                resolve(links);

            }, function(err) {
                reject(err);
            });
        });
    },

    getPageLinks: function(page, lang) {

        return new Promise(function (resolve, reject) {
            
            //If no page specified, return error
            if(!page)
                reject("ERROR: No page specified.");

            lang = lang || "en";    //If the language was not specified, set en (English)

            var requestUrl = "https://" + lang + ".wikipedia.org/w/api.php?action=query&redirects&pllimit=500&format=json&prop=links&titles=" + page;

            getPartialLinks(requestUrl, function(buffer, err) {
                //If error
                if(err) //reject with error obj
                    reject(err);
                else //if no error, resolve with buffer
                    resolve(buffer);
            });

        });
    }

}


function getPartialLinks(url, callback, originalUrl, buffer) {

    //Set optional options
    originalUrl = originalUrl || url;   //Original url to be used for continue options
    buffer = buffer || [];  //Buffer to store links

    //Execute get request
    httpsGet(url).then(function(recData) {

        //Parse json result
        recObj = JSON.parse(recData);            

        //Iterate thru the pages
        for(var page in recObj['query']['pages']) {

            var pageObj = recObj['query']['pages'][page];

            //Iterate thru the links on the page
            for(var link in pageObj['links']) {
                var linkObj = pageObj['links'][link];
                buffer.push(linkObj['title']);
            }
        }

        //If we still got results to go
        if(recObj['continue']) {
            //Recurse this function again
            var continueUrl = originalUrl + "plcontinue=" + recObj['continue']["plcontinue"];
            getPartialLinks(continueUrl, callback, originalUrl, buffer);
        } else {
            //If there is no continue (results to gather), resolve the callback
            callback(buffer);
        }

    }, function(err) {
        //If some error, resolve callback with null
        callback(null, err);
    });
}


function httpsGet(url) {

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