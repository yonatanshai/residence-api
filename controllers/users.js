const User = require('../models/user');
const HttpError = require('../models/http-error');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        if (!users) {
            return next(new HttpError('Error getting users: users not found', 404));
        }
        res.json({ users: users.map(u => u.toObject({ getters: true })) })
    } catch (error) {
        return next(new HttpError('Error getting users', 500));
    }
}


module.exports = {
    getAllUsers
}