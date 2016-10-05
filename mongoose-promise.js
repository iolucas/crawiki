module.exports = this;  //Enable this module to be exported

var mongoose = require('mongoose');
var Promise = require('promise');

this.connect = function(collection) {

	return new Promise(function (resolve, reject) {

		mongoose.connect('mongodb://localhost/' + collection);

		var db = mongoose.connection;

		db.on('error', function(){
			reject(arguments);
		});

		db.once('open', function() {
			//Connection made
			var dataSchema = mongoose.Schema({},{ strict: false });
			var MusicData = mongoose.model('MusicData', dataSchema);
			var KeywordIndex = mongoose.model('KeywordIndex', dataSchema);	

			resolve({insert:function insert(newEntry) {
				
				return new Promise(function (insertResolve, insertReject) {
					
					var newMusicData = new MusicData(newEntry);
					newMusicData.save(function(err, entry) {
						if(err)
							insertReject(err)
						else
							insertResolve(entry);
					});

				});

			},mongoose:mongoose, musicData: MusicData, keywordIndex: KeywordIndex});
		});

	});
}


/*mongoose.connect('mongodb://localhost/composindb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// we're connected!
	console.log('conected');
	start();
});

add dbs and backup dbs
function start() {

	var musicDataSchema = mongoose.Schema({
    	title: String
	});

	var MusicData = mongoose.model('MusicData', musicDataSchema);

	var silence = new MusicData({});

	silence.save(function(err, coll) {
		console.log(arguments);

	});

}*/