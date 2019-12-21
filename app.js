const express = require('express')
const bodyParser = require('body-parser');

const usersRoutes = require('./routes/users');


const app = express()


app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/users', usersRoutes);

app.use((req, res, next) => {
    throw new HttpError('Could not find this route', 404);
})

app.use((error, req, res, next) => {
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred' });
})



module.exports = app;


