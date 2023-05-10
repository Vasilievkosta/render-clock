const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const db = require('./db');
const router = require('./routes/appRouter');

// console.log(JSON.stringify(process.env))

const PORT = process.env.PORT || 5000;

let token = () => {
	return Math.trunc(Math.random()*1e6).toString(36);
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use('/api', router);


app.get('/', (req, res) => {
	console.log('start for Render');
	
	res.send('start !');
});

app.post('/auth', function async(req, res) {
	console.log(req.body);	
	let valid = req.body.password === process.env.ADMIN_PASSWORD && req.body.email === process.env.ADMIN_EMAIL;
			
	console.log(valid);	
	if (valid) {
		res.cookie('token', token(), {
			secure: true,
			httpOnly: true,
		});	
		global.name = valid
		console.log(global.name)
	}	
	if (!req.body) return res.sendStatus(400);
	res.json(valid);
});

app.get('/logout', (req, res) => {
	console.log('logout');
	res.clearCookie('token');
	global.name === false
	res.send('logout');
});

app.use((req, res) => {
	res.status(404).send('<h2>404 No Page Found</h2>');
});

app.listen(PORT, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log(`Server is starting on port ${PORT}`);
});
