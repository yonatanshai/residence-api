const HttpError = require('../Models/http-error');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            console.log('token not found');
            throw new Error('Authentication required');
        }
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = {
            userId: decodedToken.userId
        };
        next();
    } catch (error) {
        console.log(error);
        res.status(403).send({ error: 'Authentication required' });
    }
};