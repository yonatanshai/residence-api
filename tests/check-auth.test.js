const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { setupDb } = require('./fixtures/db');

beforeEach(setupDb);

describe('check-auth', () => {
	test('should not authenticate a valid token for a non existing user', async(done) => {
		const id = new mongoose.Types.ObjectId();
		const token = jwt.sign({ userId: id, email: 'email@test.com' }, process.env.JWT_KEY, { expiresIn: '1h' });
		await request(app)
			.post('/groups')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'test group',
				description: 'Test description'
			})
			.expect(401);
		done();
	});
});
