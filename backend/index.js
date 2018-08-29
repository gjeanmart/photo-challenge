// index.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    	= require('express'); 
var bodyParser 	= require('body-parser');
var multer  	= require('multer');
var cors 		= require('cors')
var fs 		   	= require('fs');
var MongoClient = require('mongodb').MongoClient;
var ObjectId 	= require('mongodb').ObjectId;

// HTTP Server host and port
const port = process.env.API_PORT || 8080;    // set our port
const host = process.env.API_HOST || '0.0.0.0';    // set our host

// Upload
const photosFolder = '/home/gjeanmart/workspace/other/photo-challenge/frontend/src/assets/imgs/photos/';
const challengesFolder = '/home/gjeanmart/workspace/other/photo-challenge/frontend/src/assets/imgs/challenges/';
var photoFolderUpload 	= multer({ dest: photosFolder })
var challengeFolderUpload 	= multer({ dest: challengesFolder })

// Database
const dbName = 'photo-challenge';
const url = 'mongodb://localhost:27017/';
var db;

// API
// =============================================================================
var app    = express();    
var router = express.Router();

router.post('/challenge', challengeFolderUpload.single('file'), function (req, res, next) {
	console.log("POST /challenge [body: " + JSON.stringify(req.body.content) + ", file: " + JSON.stringify(req.file) + "]")  	

	var body = JSON.parse(req.body.content);

	if(!body.name) res.status(400).send('name required');
	if(!body.category) res.status(400).send('category required');

	var challenge = {
		"name": body.name,
		"description": body.description,
		"category": body.category,
		"file": req.file
	}
  	db.collection('challenge').insertOne(challenge, (err, result) => {
    	if (err) return console.log(err)
    	console.log('challenge ' + JSON.stringify(challenge) + ' saved to database')
  		res.json(result); 
  	})
})

router.get('/challenge', (req, res) => {
	console.log("GET /challenge: ")
  	db.collection('challenge').find().toArray(function(err, results) {
  		res.json(results);  
	}) 
})
router.post('/photo', photoFolderUpload.single('file'), function (req, res, next) {
	console.log("POST /photo [body: " + JSON.stringify(req.body) + ", file: " + JSON.stringify(req.file) + "]")  	

  	db.collection('photo').insertOne({challengeId: req.body.content, file: req.file}, (err, result) => {
    	if (err) return console.log(err)
    	console.log('Photo ' + req.file.path + ' uploaded for challenge ' + req.body.content)
  		res.json(result); 
  	})
})
router.get('/photo', (req, res) => {
	console.log("GET /photo: ")
  	db.collection('photo').find().toArray(function(err, results) {
  		res.json(results);  
	}) 
})
router.get('/photo/:challengeId', (req, res) => {
	console.log("GET /photo: ")
  	db.collection('photo').find({challengeId: req.params.challengeId}).toArray(function(err, results) {
  		res.json(results);  
	}) 
})
router.get('/download/:photoId', function(req, res){
	console.log("GET /photo [id:"+req.params.photoId+"] ")

	db.collection("photo").findOne({_id: ObjectId(req.params.photoId)}, function(err, result) {
		console.log(result)
    	if (err) return console.log(err)
  		var file = __dirname + '/' + result.file.path;


  		res.setHeader('Content-disposition', 'attachment; filename=' + result.file.originalname);
  		res.setHeader('Content-type', result.file.mimetype);
  		res.download(file); 
  	});
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use('/api', router);




// Run
// =============================================================================
MongoClient.connect(url, (err, client) => {
  if (err) return console.log(err)
  db = client.db(dbName) // whatever your database name is
  app.listen(port, host, () => {
    console.log('listening on ' + host + ":" + port)
  })
})