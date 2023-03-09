const express = require('express');
const cors = require('cors');
const db = require('./db');
const router = require('./routes/appRouter');

// console.log(JSON.stringify(process.env))

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

app.get('/', (req, res) => {	
	console.log('start for Render');
	res.send('start !');
});

app.post("/login2", function (req, res) {
	console.log(req.body);
	let valid = req.body.password === 'passwordsecret' && req.body.email === 'admin@example.com';
	//let valid = req.body.password === '1' && req.body.email === '1';
	console.log(valid);
	if (!req.body) return res.sendStatus(400);
	res.json(valid);
});

app.use((req, res) => {
	res.status(404).send('<h2>No Page Found</h2>');
});

app.listen(PORT, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log(`Server is starting on port ${PORT}`);
});