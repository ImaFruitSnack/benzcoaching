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

const application = express();
application.use(bodyParser.json())
application.use(express.static(path.join(__dirname, 'public')));
application.set('view engine' , 'ejs');
application.use(express.urlencoded({ extended: true }));

async function encryptt(word) {
	const hash = createHmac('sha256', secret)
			.update('${word}')
               .digest('hex');
	return hash;
}

application.get(`/`, async(req, res) => {
	res.render('pages/index');
	let data = await fs.readFileSync('./views/pages/index.ejs');
	console.log(encryptt('test'));
	res.write(data);
})

application.get('/courses', async(req, res) => {
	res.render('pages/courses');
})

application.get('/login', async(req, res) => {
	res.render('pages/login');
})

application.get('/signup', async(req, res) => {
	res.render('pages/signup');
})

application.get('/contact', async(req, res) => {
	res.render('pages/contact');
})

let server = http.createServer(application)
server.listen(8080, `0.0.0.0`)