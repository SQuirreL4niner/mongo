var express = require('express'),
	app = express(),
	engines = require('consolidate'),
	MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
	bodyParser = require('body-parser');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {
	
	assert.equal(null, err);
	console.log("Successfully connected to MongoDB");
	console.trace("Print out this stacktrace");
	
	app.get('/', function(req, res) {
		db.collection('movies').find({}).toArray(function(err, docs) {
			res.render('movies', { 'movies': docs } );
		});
	});
	
	app.post('/insert_movie', function(req, res, next) {
		var newTitle = req.body.title;
		var newYear = req.body.year;
		var newImbd = req.body.imbd;
		if ((newTitle == '')  || (newYear == '') || (newImbd == '')) {
			next('Please type in a new movie to enter in database');		} 
		else {
			db.collection('movies').insertOne(
				{ 'title': newTitle, 'year': newYear, 'imbd': newImbd },
					function(err, r){
						assert.equal(null, err);
						res.send("Document inserted with an id of " + r.insertedId);
						}
				);
			}
		});
			//res.send("The movie you entered into the database is: " + newTitle );
	

	app.use(function(req, res){
		res.sendStatus(404);
	});


	var server = app.listen(3000, function() {
		var port = server.address().port;
		console.log('Express server listening on port %s', port);
	});
});
