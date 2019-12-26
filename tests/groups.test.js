const request = require('supertest');
const app = require('../app');
const { userOne, userOneId, groupOneId, setupDb } = require('./fixtures/db');


beforeEach(setupDb);

// eslint-disable-next-line no-undef
describe('Groups', () => {
	test('should create a group by a user', async(done) => {
		await request(app)
			.post('/groups/')
			.set('Authorization', `Bearer ${userOne.token}`)
			.send({
				name: 'test group',
				description: 'Test description'
			})
			.expect(201);
		done();
	});

	test('should not create a group for an unauthenticated user', async(done) => {
		await request(app)
			.post('/groups/')
			.set('Authorization', `Bearer ${userOne.token}1`)
			.send({
				name: 'test group',
				description: 'Test description'
			})
			.expect(403);
		done();
	});

	test('should not create a group when a name is not provided', async(done) => {
		await request(app)
			.post('/groups')
			.set('Authorization', `Bearer ${userOne.token}`)
			.send({
				description: 'Test description'
			})
			.expect(422);

		done();
	});

	test('should not create a group when name is empty', async(done) => {
		await request(app)
			.post('/groups')
			.set('Authorization', `Bearer ${userOne.token}`)
			.send({
				name: '  ',
				description: 'Test description'
			})
			.expect(422);

		done();
	});

	test('should return a group by its id', async(done) => {
		const response = await request(app)
			.get(`/groups/${groupOneId}`)
			.set('Authorization', `Bearer ${userOne.token}`)
			.expect(200);

		const group = response.body.group;
		expect(group.admins).toBeDefined();

		done();
	});

	test('should not return a group for an unauthenticated user', async(done) => {
		await request(app)
			.get(`/groups/${groupOneId}`)
			.set('Authorization', `Bearer ${userOne.token}1`)
			.expect(403);

		done();
	});

	test('should return a group given a user id', async(done) => {
		await request(app)
			.get(`/groups/users/${userOneId}`)
			.set('Authorization', `Bearer ${userOne.token}`)
			.expect(200);

		done();
	});
});
