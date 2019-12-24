const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Group = require('../models/group');
const {userOne, userOneId, setupDb} = require('./fixtures/db');

// beforeAll(async (done) => {
//     // jest.setTimeout = 30000;

//     await mongoose.connect(`mongodb://127.0.0.1/ResidenceTest`, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     });

//     done();

// })

// let userOne = {
//     // _id: new mongoose.Types.ObjectId(),
//     name: 'Test User',
//     email: 'test5@test.com',
//     password: '12345678'
// }

// let groupOne = {
//     name: 'test group',
//     createdAt: new Date(),
// }

// beforeAll(async () => {
//     await Group.deleteMany();
//     await User.deleteMany();
// })

// beforeEach(async (done) => {
//     await Group.deleteMany();
//     await User.deleteMany();
//     const hashedPassword = await bcrypt.hash(userOne.password, 12);
//     userOne = await new User({
//         ...userOne,
//         password: hashedPassword
//     }).save();

//     groupOne = await new Group({
//         ...groupOne,
//         creator: userOne._id,
//         admins: [userOne._id],
//         members: [userOne._id]
//     }).save();
//     done();
// })

beforeEach(setupDb);

describe('Groups', () => {
    test('should create a group by a user', async (done) => {
        const response = await request(app)
            .post(`/groups/users/${userOneId}`)
            .send({
                name: 'test group',
                description: 'Test description'
            })
            .expect(201);
        done();
    });

    test('should return a group given a user id', async (done) => {
        await request(app)
            .get(`/groups/user/${userOneId}`)
            .expect(200)

        done();
    });
});