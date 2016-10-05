var https = require('https');
var Promise = require('promise');
var fs = require('fs')



/*for result in query({'generator': 'allpages', 'prop': 'links'}):
    # process result data
...
def query(request):
    request['action'] = 'query'
    request['format'] = 'json'
    lastContinue = {'continue': ''}
    while True:
        //# Clone original request
        req = request.copy()
        //# Modify it with the values returned in the 'continue' section of the last result.
        req.update(lastContinue)
        //# Call API
        result = requests.get('http://en.wikipedia.org/w/api.php', params=req).json()
        if 'error' in result:
            raise Error(result['error'])
        if 'warnings' in result:
            print(result['warnings'])
        if 'query' in result:
            yield result['query']
        if 'continue' not in result:
            break
        lastContinue = result['continue']*/


var crawUrl = "https://en.wikipedia.org/w/api.php?action=query&pllimit=500&format=json&prop=links&titles=Python"
var linkBuffer = ""


getLinks(crawUrl);

function getLinks(crawUrl) {
    console.log("Querying...")
    httpGet(crawUrl)
        .then(function(recData){
            console.log("Partial query finished.");
            //console.log(recData)

            //Parse json result
            recObj = JSON.parse(recData);            

            for(var page in recObj['query']['pages']) {

                var pageObj = recObj['query']['pages'][page];

                for(var link in pageObj['links']) {
                    var linkObj = pageObj['links'][link];
                    linkBuffer += linkObj['title'] + "\r\n";
                }
            }

            if(recObj['continue']) {
                console.log("Continuing query...");
                getLinks(crawUrl + "plcontinue=" + recObj['continue']["plcontinue"]);
            } else {
                console.log("Query Finished");
                console.log(linkBuffer);
                console.log("Writing...");
                fs.appendFileSync("links.txt", linkBuffer);
                console.log("Done.");
            }
    }, function(err){
        console.log(arguments)
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