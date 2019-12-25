
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
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

const getUserById = async(req, res, next) => {
    const userId = req.params.uid;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({message: 'User not found'});
        }

        return res.json({user});
    } catch (error) {
        return res.status(500).send({message: error.message});
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
            console.log('error hashing');
            return next(new HttpError('Error signing up', 500));
        }

        const createdUser = new User({
            name,
            email,
            password: hashedPassword,
            groups: []
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
            console.log('error signing up');
            return next(new HttpError('Error signing up', 500));
        }

        res.status(201).json({
            id: createdUser.id,
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
        return res.status(500).send({message: 'error logging in'});
    }

    if (!existingUser) {
        return res.status(401).send({message: 'wrong email or password'})
    }

    let isPasswordValid = false;
    try {
        isPasswordValid = await bcrypt.compare(password, existingUser.password)
    } catch (error) {
        return res.status(500).send({message: 'error logging in'});
    }

    if (!isPasswordValid) {
        return res.status(401).send({message: 'wrong email or password'})
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
        return res.status(500).send({message: 'error logging in'});

    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token
    })
}


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    login
}