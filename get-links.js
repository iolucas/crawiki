var Crawler = require("crawler");
var url = require('url');
var fs = require("fs")


var linkBuffer = ""

var c = new Crawler({
    maxConnections : 10,

    skipDuplicates: true,

    // This will be called for each crawled page
    callback : function (error, result, $) {
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server
        $('a').each(function(index, a) {
            var toQueueUrl = $(a).attr('href');
            //c.queue(toQueueUrl);
            //console.log(toQueueUrl)
            if(toQueueUrl && toQueueUrl.substr(0,6) == "/wiki/") {
                linkBuffer += toQueueUrl + "\n\r"
            }
        });
    }
});

// Queue just one URL, with default callback
c.queue('https://en.wikipedia.org/wiki/Albert_Einstein');