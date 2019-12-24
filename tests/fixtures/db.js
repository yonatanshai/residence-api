const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../../app');
const Group = require('../../models/group');
const User = require('../../models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOneHashedPassword = bcrypt.hashSync('12345678', 12);
let userOne = {
    _id: userOneId,
    name: 'Test user',
    email: 'test@test.com',
    password: userOneHashedPassword
};

const groupOne = {
    name: 'test group',
    createdAt: new Date(),
}


const setupDb = async () => {
    await User.deleteMany();
    await Group.deleteMany();


    // const hashedPassword = await bcrypt.hash(userOne.password, 12);
    // userOne = await new User({
    //     ...userOne,
    //     password: hashedPassword
    // }).save();
    await new User(userOne).save();

    await new Group({
        ...groupOne,
        creator: userOneId,
        admins: [userOneId],
        members: [userOneId]
    }).save();
}

module.exports = {
    userOne,
    groupOne,
    setupDb,
    userOneId
};