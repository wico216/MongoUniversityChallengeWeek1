var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    bodyParser = require('body-parser');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true })); 


MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    app.get('/', function(req, res) {
        res.render('landingPage');
    });

    app.get('/addMovies', function(req,res){
        res.render('addMovies');
    });

    app.post('/submit',function (req,res,next){
        var newtitle = req.body.title;
        var newyear = req.body.year;
        var newimdb = req.body.imdb;

        db.collection('movies').insertOne({"title": newtitle, "year": newyear, "imdb": newimdb});
        res.render('submit');
    });

    app.get('/movies', function(req, res){

        db.collection('movies').find({}).toArray(function(err, docs) {
            res.render('movies', { 'movies': docs } );
        });

    });

    app.use(function(req, res){
        res.sendStatus(404);
    });
    
    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });

});




