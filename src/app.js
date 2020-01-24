const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');
const usersRoutes = require('./routes/users');
const groupRoutes = require('./routes/groups');
const serviceCallsRoutes = require('./routes/service-calls');
// require('./db/mongoose');

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

// mongoose
// 	.connect('mongodb+srv://yonatans:SNZrBJvmQqOErBb9@cluster0-ngxlm.mongodb.net/ResidenceDev?retryWrites=true&w=majority')
// 	.then(() => app.listen(port, () => console.log(`Server listening on port ${port}!`)))
// 	.catch((err) => console.log(err));


module.exports = app;
