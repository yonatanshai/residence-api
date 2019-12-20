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

const createUser = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        console.log(existingUser);
        if (existingUser) {
            return next(new HttpError('Error signing up: a user with this email already exists', 422));
        }

        const createdUser = new User({
            name,
            email,
            password
        });

        try {
            await createdUser.save();
        } catch (error) {
            console.log('error saving user ' + error.message);
            return next(new HttpError('Error creating user', 500));
        }

        res.status(201).json({
            userId: createdUser.id,
            email: createdUser.email
        });
    } catch (error) {
        console.log('error saving user ' + error.message);
        return next(new HttpError('Error creating user', 500));
    }
}


module.exports = {
    getAllUsers,
    createUser
}