const express = require(`express`);
const bodyParser = require(`body-parser`);
const path = require('node:path');
const fs = require(`node:fs`);
const http = require(`node:http`);
const url = require('url');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.mongoToken;
const { createHmac } = require('node:crypto');
const v = fs.readFileSync("/etc/secrets/enckey", 'utf8');
eval(v);
global.mtest = 0;
global.uservalue = null;
global.Password = null;
global.loggedin = null;
global.tdata = null;

const application = express();
application.use(bodyParser.json())
application.use(express.static(path.join(__dirname, 'public')));
application.set('view engine' , 'ejs');
application.use(express.urlencoded({ extended: true }));

const client = new MongoClient(uri);

async function run() {
  try {
	const client = new MongoClient(uri);
    const database = client.db('benzdb');
    const users = database.collection('userdata');
    const query = { user: uservalue['username'] };
    const user = await users.findOne(query);
	encryptt(uservalue['password'].toString());
	console.log(tdata);
	console.log("got");
	if (user == null) {
		global.loggedin = false;
		console.log("how");
		console.log(uservalue['username']);
		return [loggedin,mtest];
	}
	if (user['password'].toString() == tdata.toString() && user['user'].toString() == uservalue['username'].toString()) {
		global.mtest = user;
		console.log("success");
		global.loggedin = true;
		return [loggedin,mtest];
	} else {
		global.loggedin = false;
		console.log("failed");
		return [loggedin,mtest];
	}
  } finally {
    await client.close();
  }
}

async function encryptt(word) {
	const hash = createHmac('sha256', secret)
			.update('${word}')
               .digest('hex');
	tdata = hash;
	return hash;
}

application.get(`/`, async(req, res) => {
	res.render('pages/index');
	let data = await fs.readFileSync('./views/pages/index.ejs');
	res.write(data);
})

application.get('/courses', async(req, res) => {
	res.render('pages/courses');
})

application.get('/login', async(req, res) => {
	res.render('pages/login', {er:null});
})

application.get('/signup', async(req, res) => {
	res.render('pages/signup');
})

application.get('/contact', async(req, res) => {
	res.render('pages/contact');
})

application.post('/submit' , async(req , res) => {
	global.uservalue = req.body;
	await run().catch(console.dir);
	if (loggedin == true) {
		console.log(tdata);
		res.render('pages/mycourses' , {er:null});
	} else if (loggedin == false) {
		res.render('pages/login' , {er:"Username Or password is incorrect"});
		console.log(tdata);
	} else {
		console.log("what?");
		return;
	}
})

let server = http.createServer(application)
server.listen(8080, `0.0.0.0`)