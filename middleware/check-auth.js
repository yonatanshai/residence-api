const HttpError = require('../Models/http-error');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        
        if (!token) {
            console.log('token not found');
            throw new Error('Authentication failed');
        }
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = {
            userId: decodedToken.userId
        };
        next();
    } catch (error) {
        console.log(error);
        return next(new HttpError('Authentication failed', 403));
    }
};