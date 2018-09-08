// index.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    	= require('express'); 
var bodyParser 	= require('body-parser');
var multer  	= require('multer');
var cors 		= require('cors')
var fs 		   	= require('fs');
const mongoist = require('mongoist');
const MongoPaging = require('mongo-cursor-pagination');

// HTTP Server host and port
const port = process.env.API_PORT || 8080;    // set our port
const host = process.env.API_HOST || '0.0.0.0';    // set our host

// Upload
const base = '/opt/workspace/photo-challenge/backend/' 
const photosFolder = base+'photos/';
const challengesFolder = base+'challenges/';
var photoFolderUpload 	= multer({ dest: photosFolder })
var challengeFolderUpload 	= multer({ dest: challengesFolder })

// Database
const pageSize = 5;
const url = 'mongodb://localhost:27017/photo-challenge';
const db = mongoist(url);


// FUNCTIONS
// =============================================================================
async function getChallenges(){
	return await db.challenge.find();
}
async function getChallenge(id) {
	return await db.challenge.findOne({ _id: mongoist.ObjectId(id) });
}
async function saveChallenge(challenge) {
	return await db.challenge.save(challenge);
}
async function getPhotos() {
	return await db.photo.findAsCursor().sort({dateCreated: -1}).toArray();
}
async function getPhoto(id) {
	return await db.photo.findOne({ _id: mongoist.ObjectId(id) });
}
async function savePhoto(photo) {
	return await db.photo.save(photo);
}

// API
// =============================================================================
var app    = express();    
var router = express.Router();

router.post('/challenge', challengeFolderUpload.single('file'), function (req, res, next) {
	console.log("POST /challenge [body: " + JSON.stringify(req.body.content) + ", file: " + JSON.stringify(req.file) + "]")  	

	var body = JSON.parse(req.body.content);

	if(!body.name) res.status(400).send('name required');

	var challenge = {
		"name": body.name,
		"description": body.description,
		"file": req.file,
		"dateCreated": new Date()
	};

  	saveChallenge(challenge).then(result => {
  		res.json(result); 
  	});
});

router.get('/challenge', (req, res) => {
	console.log("GET /challenge: ")
	getChallenges().then(results => res.json(results));
});

router.get('/challenge/:challengeId/thumbnail', function(req, res){
	console.log("GET /challenge [id:"+req.params.challengeId+"] ")

	getChallenge(req.params.challengeId).then(result => {
  		var file = __dirname + '/' + result.file.path;

  		res.setHeader('Content-disposition', 'attachment; filename=' + result.file.originalname);
  		res.setHeader('Content-type', result.file.mimetype);
  		res.download(file); 
	});
});

router.post('/photo', photoFolderUpload.single('file'), function (req, res, next) {
	console.log("POST /photo [body: " + JSON.stringify(req.body) + ", file: " + JSON.stringify(req.file) + "]")  	

	var photo = {
		"challengeId": req.body.content,
		"file": req.file,
		"user": req.headers.user,
		"dateCreated": new Date()
	};

  	savePhoto(photo).then(result => {
  		res.json(result); 
  	});
});

router.get('/photo', (req, res) => {
	console.log("GET /photo: ")

  	MongoPaging.find(db.photo, {
    	limit: pageSize,
  		paginatedField: 'dateCreated',
    	next: req.query.next 
  	}).then(async function(data) {
		for (var i = 0; i < data.results.length; i++) {  
			 data.results[i].challenge = await getChallenge( data.results[i].challengeId);
		}
  		res.json(data);  
  	});
});

router.get('/download/:photoId', function(req, res){
	console.log("GET /photo [id:"+req.params.photoId+"] ")

	getPhoto(req.params.photoId).then(result => {
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
app.listen(port, host, () => {
	console.log('listening on ' + host + ":" + port)
})