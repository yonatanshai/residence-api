const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const Group = require('../../models/group');

// beforeAll(async (done) => {
//     // jest.setTimeout = 30000;

//     await mongoose.connect(`mongodb://127.0.0.1/ResidenceTest`, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     });

//     done();

// })

let userOne = {
    name: 'Test User',
    email: 'test5@test.com',
    password: '12345678'
}

beforeEach(async (done) => {
    await Group.deleteMany();
    await User.deleteMany();
    const hashedPassword = await bcrypt.hash(userOne.password, 12);
    userOne = await new User({
        ...userOne,
        password: hashedPassword
    }).save();
    done();
})

describe('Groups', () => {
    test('should create a group by a user', async (done) => {
        console.log(userOne);
        const response = await request(app)
        .post(`/groups/user/${userOne.id}`)
        .send({
            name: 'test group',
            description: 'Test description'
        })
        .expect(201);
        done();
    });
});