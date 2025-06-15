const express = require(`express`);
const bodyParser = require(`body-parser`);
const path = require('node:path');
const fs = require(`node:fs`);
const http = require(`node:http`);
const url = require('url');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.mongoToken;
global.mtest = 0;
global.uservalue = null;
global.Password = null;
global.loggedin = null;

const application = express();
application.use(bodyParser.json())
application.use(express.static(path.join(__dirname, 'public')));
application.set('view engine' , 'ejs');
application.use(express.urlencoded({ extended: true }));

application.get(`/`, async(req, res) => {
	res.render('pages/index');
	let data = await fs.readFileSync('./views/pages/index.ejs');
	res.write(data);
})

application.get(`/courses`, async(req, res) => {
})

application.get(`/login`, async(req, res) => {

application.get(`/signup`, async(req, res) => {
})

application.get(`/contact`, async(req, res) => {
})

let server = http.createServer(application)
server.listen(8080, `0.0.0.0`)