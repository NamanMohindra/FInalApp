const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const auth = require('./src/auth');
const articles = require('./src/articles');
const profile = require('./src/profile');
const following = require('./src/following');

const app = express()

app.use(function (req, res, next) {
    const allowedOrigins = ["http://localhost:3000","https://uptight-key.surge.sh","https://shut-teeth.surge.sh"]
    const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

	//res.header("Access-Control-Allow-Origin", ["http://localhost:3000","https://uptight-key.surge.sh"])
    res.header("Access-Control-Allow-Headers", 'Origin, Authorization, Content-Type, X-Requested-With, X-Session-Id, Accept')
	res.header("Access-Control-Allow-Methods", 'POST, PUT, GET, DELETE, OPTIONS')
    res.header("Access-Control-Allow-Credentials", true)
	
	if (req.method == 'OPTIONS') {
		res.status(200).send('success')
	} else {
		next()
	}
});

const hello = (req, res) => res.send({ hello: 'world' });

app.use(bodyParser.json())
app.use(cookieParser())

app.get('/', hello);
auth(app)
articles(app)
profile(app)
following(app)

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 8080
const server = app.listen(port, () => {
  const addr = server.address()
  console.log(`Server listening at http://${addr.address}:${addr.port}`)
})
