
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { userOne, userOneId, setupDb } = require('./fixtures/db');

// beforeAll(async (done) => {
//     // jest.setTimeout = 30000;

//     await mongoose.connect(`mongodb://127.0.0.1/ResidenceTest`, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     });

//     done();

// })

// const userOne = {
//     _id: new mongoose.Types.ObjectId(),
//     name: 'Test User',
//     email: 'test@test.com',
//     password: '12345678'
// }

// const userTwo = {
//     name: 'Test User',
//     email: 'test2@test.com',
//     password: '12345678'
// }

// beforeEach(async (done) => {
//     await User.deleteMany();
//     const hashedPassword = await bcrypt.hash(userOne.password, 12);

//     await new User({
//         ...userOne,
//         password: hashedPassword
//     }).save();
//     done();
// })
// beforeAll(async () => await User.deleteMany());

beforeEach(setupDb);

describe('# Users', () => {
    test('Should signup a new user', async (done) => {
        console.log(userOne);
        const response = await request(app)
            .post('/users/signup')
            .send({
                name: 'test2',
                email: 'test@email.com',
                password: '12345678'
            })
            .expect(201)
        done();
    });

    test('Should return a token when signing up a new user', async (done) => {
        const response = await request(app)
            .post('/users/signup')
            .send({
                name: 'test2',
                email: 'test@email.com',
                password: '12345678'
            })

        expect(response.body.token).toBeDefined();
        done();
    })

    test('should get users array from the db', async (done) => {
        const response = await request(app)
            .get('/users')
            .expect(200);

        expect(response.body.users.length).toBeDefined();
        done();
    });

    // test('should login an existing user', async (done) => {
    //     const userOneHashedPassword = await bcrypt.hash(userOne.password, 12);
    //     await request(app)
    //         .post('/users/login')
    //         .send({
    //             email: userOne.email,
    //             password: userOneHashedPassword,
    //         })
    //         .expect(200)
    //     done();
    // });

    test('should fail to login with wrong password', async (done) => {
        await request(app)
            .post('/users/login')
            .send({
                email: userOne.email,
                password: userOne.password + '1'
            })
            .expect(401);
        done();
    });

    test('should not return the password on login', async (done) => {
        const response = await request(app)
            .post('/users/login')
            .send({
                email: 'test@test.com',
                password: '12345678'
            })

        expect(response.body.password).toBeFalsy()
        done();
    })

    test('should return a user by its ID', async (done) => {
        await request(app)
            .get(`/users/${userOneId}`)
            .expect(200)

        done();
    });


});