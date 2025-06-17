const express = require(`express`);
const bodyParser = require(`body-parser`);
const cookieParser = require(`cookie-parser`);
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

const application = express();
application.use(cookieParser());
application.use(bodyParser.json());
application.use(express.static(path.join(__dirname, 'public')));
application.set('view engine' , 'ejs');
application.use(express.urlencoded({ extended: true }));

const client = new MongoClient(uri);

async function run(info) {
  try {
	  console.log(info);
	const client = new MongoClient(uri);
    const database = client.db('benzdb');
    const users = database.collection('userdata');
    const query = { user: info['username'] };
    const user = await users.findOne(query);
	info['password'] = await encryptt(info['password']);
	console.log(info['password']);
	if (user == null) {
		const loggedin = false;
		console.log('it was null');
		return {loggedin: loggedin};
	}
	if (user['password'].toString() == info['password'].toString() && user['user'].toString() == info['username'].toString()) {
		const loggedin = true;
		console.log('it was truee');
		return {loggedin: loggedin, user: info['username']};
	} else {
		const loggedin = false;
		console.log('it was false');
		console.log(info['password'].toString());
		console.log(user['password'].toString());
		
		return {loggedin: loggedin};
	}
  } finally {
    await client.close();
  }
}

async function encryptt(word) {
	const hash = createHmac('sha256', secret)
			.update('${word}')
               .digest('hex');
	word = hash;
	console.log(word);
	return word;
}

async function getCookie(name) {
	if (typeof window !== "undefined") {
		
	const cookieString = document.cookie;
	const cookies = cookieString.split(';');
		for (let cookie of cookies) {
			let [cookieName, cookieValue] = cookie.trim().split('=');
			if (cookieName === name) {
			return cookieValue;
    }
  }
  return null;
	}
}

application.get(`/`, async(req, res) => {
	res.cookie('mtest' , 0);
	res.cookie('uservalue' , null);
	res.cookie('Password' , null);
	res.cookie('loggedin' , null);
	res.cookie('tdata' , null);
	res.render('pages/index');
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

application.get('/mycourses', async(req, res) => {
	if (!req.cookies.token) return res.status(401).send();
	res.render('pages/mycourses');
})

application.post('/submit' , async(req , res) => {
	const uservalue = req.body;
	let result = await run(uservalue).catch(console.dir);
	if (result.loggedin == true) {
		res.cookie('user', result.user);
		res.redirect('/mycourses');
	} else if (result.loggedin == false) {
		res.render('pages/login' , {er:"Username Or password is incorrect"});
	} else {
		console.log("what?");
		return;
	}
})

let server = http.createServer(application)
server.listen(8080, `0.0.0.0`)