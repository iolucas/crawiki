var Promise = require('promise');
var wikipediaDataApi = require("./wikipediaDataApi.js")

var page = process.argv[2];
var lang = process.argv[3] || "en";

if(!page) {
    console.error("No page specified.");
    process.exit(1);
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

//Replace bug characters
page = page.replaceAll("%E2%80%93", "-");
page = page.replaceAll("–", "-");


console.log("Getting links for " + page + " in language " + lang + "...");
console.log("");

wikipediaDataApi.getPageAbstractLinks(page, lang).then(function(links) {

	for (var i = 0; i < links.length; i++) {
		console.log(links[i]);
	};

	console.log("");
	console.log("Done.");

}, function(err){
	console.log("ERROR:");
	console.error(err)
})