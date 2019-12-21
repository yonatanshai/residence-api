
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../models/user');

// beforeAll(async (done) => {
//     // jest.setTimeout = 30000;

//     await mongoose.connect(`mongodb://127.0.0.1/ResidenceTest`, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     });

//     done();

// })

const userOne = {
    name: 'Test User',
    email: 'test@test.com',
    password: '12345678'
}

const userTwo = {
    name: 'Test User',
    email: 'test2@test.com',
    password: '12345678'
}

beforeEach(async (done) => {
    await User.deleteMany();
    const hashedPassword = await bcrypt.hash(userOne.password, 12);
    await new User({
        ...userOne,
        password: hashedPassword
    }).save();
    done();
})

describe('#Users', () => {
    test('Should signup a new user', async (done) => {
        const response = await request(app)
            .post('/users/signup')
            .send(userTwo)
            .expect(201)
        done();
    });

    test('Should return a token when signing up a new user', async (done) => {
        const response = await request(app)
            .post('/users/signup')
            .send(userTwo)

        expect(response.body.token).toBeDefined();
        done();
    })

    test('should get users array from the db', async (done) => {
        const response = await request(app)
            .get('/users')
            .expect(200);

        expect(response.body.users.length).toBe(1);
        done();
    });

    test('should login an existing user', async (done) => {
        await request(app)
            .post('/users/login')
            .send({
                email: userOne.email,
                password: userOne.password,
            })
            .expect(200)
        done();
    });

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


});