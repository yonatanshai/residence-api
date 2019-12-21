const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/user');
const Group = require('../models/group');

const getGroupsByUserId = async (req, res) => {
    console.log('getByIdCalled');
    const userId = req.params.uid;

    let userWithGroups;
    try {
        userWithGroups = await User.findById(userId).populate('groups');
    } catch (error) {
        return res.status(500).send({message: 'error'});
    }

    if (!userWithGroups.groups) {
        return res.status(404).send({message: 'not found'});
    }

    return res.json({ groups: userWithGroups.groups.map(g => g.toObject({ getters: true })) });
}

const createGroup = async (req, res) => {
    const userId = req.params.uid;

    const { name, description } = req.body;

    const createdGroup = new Group({
        name,
        description,
        createdAt: new Date().getMilliseconds(),
        // creator: req.userData.userId,
        creator: userId,
        // admins: [req.userData.userId],
        admins: [userId],
        // members: [req.userData.userId]
        members: [userId]
    })

    let user;
    try {
        // user = await User.findById(req.userData.userId);
        user = await User.findById(userId);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }

    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await createdGroup.save({ session });
        user.groups.push(createdGroup);
        await user.save({ session });
        await session.commitTransaction();
    } catch (error) {
        return res.status(500).send({ message: error.message});
    }

    res.status(201).json({ group: createdGroup });
}


module.exports = {
    getGroupsByUserId,
    createGroup
}