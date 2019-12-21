
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const HttpError = require('../models/http-error');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, '-password');
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
        if (existingUser) {
            return next(new HttpError('Error signing up: a user with this email already exists', 422));
        }

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 12);
        } catch (error) {
            return next(new HttpError('Error signing up', 500));
        }

        const createdUser = new User({
            name,
            email,
            password: hashedPassword
        });

        try {
            await createdUser.save();
        } catch (error) {
            console.log('error saving user ' + error.message);
            return next(new HttpError('Error creating user', 500));
        }

        let token;
        try {
            token = jwt.sign(
                {
                    userId: createdUser.id,
                    email: createdUser.email,
                },
                process.env.JWT_KEY,
                {
                    expiresIn: '1h'
                }
            )
        } catch (error) {
            return next(new HttpError('Error signing up', 500));
        }

        res.status(201).json({
            userId: createdUser.id,
            email: createdUser.email,
            token
        });
    } catch (error) {
        console.log('error saving user ' + error.message);
        return next(new HttpError('Error creating user', 500));
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (error) {
        console.log(('on User.find'));
        return next(new HttpError('Error logging in', 500));
    }

    if (!existingUser) {
        console.log('user not found');
        return next(new HttpError('Wrong email or password', 401))
    }

    let isPasswordValid = false;
    try {
        isPasswordValid = await bcrypt.compare(password, existingUser.password)
    } catch (error) {
        console.log('on validating password ' + error);
        return next(new HttpError('Error logging in', 500));
    }

    if (!isPasswordValid) {
        console.log('wrong password');
        return next(new HttpError('Wrong email or password', 401))
    }

    let token;
    try {
        token = jwt.sign(
            {
                userId: existingUser.id,
                email: existingUser.email,
            },
            process.env.JWT_KEY,
            {
                expiresIn: '1h'
            }
        )
    } catch (error) {
        console.log('on creating token');
        return next(new HttpError('Error logging in', 500));
    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token
    })
}


module.exports = {
    getAllUsers,
    createUser,
    login
}