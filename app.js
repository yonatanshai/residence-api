const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');
const usersRoutes = require('./routes/users');
const groupRoutes = require('./routes/groups');
const serviceCallsRoutes = require('./routes/service-calls.js');
const mongoose = require('mongoose');
// require('./db/mongoose');

const port = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
	next();
});

app.use('/users', usersRoutes);
app.use('/groups', groupRoutes);
app.use('/service-calls', serviceCallsRoutes);

app.use(() => {
	throw new HttpError('Error: Could not find this route', 404);
});

app.use((error, req, res) => {
	console.log(error);
	res.status(error.code || 500);
	res.json({ message: error.message || 'An unknown error occurred' });
});

mongoose.connect(process.env.DB_CONNECTION_STRING)
	.then(() => app.listen(port, () => console.log(`running on port ${port}`)))
	.catch((err) => console.log(err));


module.exports = app;
