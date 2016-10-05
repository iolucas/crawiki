var wikipediaDataApi = require("./wikipediaDataApi.js")

/*wikipediaDataApi.getPageAbstractLinks().then(function(links){
    console.log(links);
}, function(err) {
    console.log(err);
});*/

wikipediaDataApi.getPageLinks("TCP/IP", "en").then(function(links){
    console.log(links);
    console.log(links.length);
}, function(err) {
    console.log(err);
});