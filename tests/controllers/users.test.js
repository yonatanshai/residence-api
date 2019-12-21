const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const User = require('../../models/user');

beforeAll(async () => {
    // jest.setTimeout = 30000;

    await mongoose.connect(`mongodb://127.0.0.1/ResidenceTest`, {useNewUrlParser: true});

})

afterAll(async () => {
    await User.deleteMany();
})

describe('Users CRUD', () => {
    test('Should signup a new user', async () => {
        await request(app)
            .post('/users')
            .send({
                name: 'Test User',
                email: 'test@test.com',
                password: '12345678'
            })
            .expect(201)
    });

    test('should get users array from the db', async (done) => {
        // jest.setTimeout = 10000;
        // jest.setTimeout.Error = 10000;
        const response = await request(app)
            .get('/users')
            .expect(200);

            expect(response.body.users.length).toBe(1);
        done();
    });

    
});