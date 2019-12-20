const request = require('supertest');
const app = require('../../app');

describe('Users', () => {
    it('Should signup a new user', async () => {
        console.log('test called');
        await request(app)
            .post('/users')
            .send({
                name: 'Test User',
                email: 'test@test.com',
                password: '12345678'
            })
            .expect(201)
    });    
});