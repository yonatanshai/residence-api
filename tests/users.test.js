
const request = require('supertest');
const app = require('../app');
const { userOne, userOneId, setupDb } = require('./fixtures/db');


beforeEach(setupDb);

describe('# Users', () => {
	describe('Signup & Login', () => {
		test('Should signup a new user', async(done) => {
			await request(app)
				.post('/users/signup')
				.send({
					name: 'test2',
					email: 'test@email.com',
					password: '12345678'
				})
				.expect(201);
			done();
		});

		test('should not signup a user with an already-used email', async(done) => {
			await request(app)
				.post('/users/signup')
				.send({
					name: 'test',
					email: 'test@test.com',
					password: '12345678'
				})
				.expect(422);
			done();
		});

		test('should not signup a user when password length is less than 8 chars', async(done) => {
			await request(app)
				.post('/users/signup')
				.send({
					name: 'test2',
					email: 'test@email.com',
					password: '1234'
				})
				.expect(422);
			done();
		});

		test('should not signup a user when email is invalid', async(done) => {
			await request(app)
				.post('/users/signup')
				.send({
					name: 'test2',
					email: 'test@@email.com',
					password: '12345678'
				})
				.expect(422);
			done();
		});

		test('Should return a token when signing up a new user', async(done) => {
			const response = await request(app)
				.post('/users/signup')
				.send({
					name: 'test2',
					email: 'test@email.com',
					password: '12345678'
				});

			expect(response.body.token).toBeDefined();
			done();
		});

		test('should get users array from the db', async(done) => {
			const response = await request(app)
				.get('/users')
				.expect(200);

			expect(response.body.users.length).toBeDefined();
			done();
		});

		test('should login an existing user', async(done) => {
			await request(app)
				.post('/users/login')
				.send({
					email: userOne.email,
					password: userOne.password
				})
				.expect(200);
			done();
		});

		test('should fail to login with wrong password', async(done) => {
			await request(app)
				.post('/users/login')
				.send({
					email: userOne.email,
					password: userOne.password + '1'
				})
				.expect(401);
			done();
		});

		test('should not return the password on login', async(done) => {
			const response = await request(app)
				.post('/users/login')
				.send({
					email: 'test@test.com',
					password: '12345678'
				});

			expect(response.body.password).toBeFalsy();
			done();
		});

		test('should return a user by its ID', async(done) => {
			await request(app)
				.get(`/users/${userOneId}`)
				.expect(200);

			done();
		});

	});
});
