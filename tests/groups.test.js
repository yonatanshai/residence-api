const request = require('supertest');
const app = require('../app');
const {
	userOne,
	userOneId,
	groupOneId,
	setupDb,
	seedDb,
	teardownDb,
	userTwoId,
	userTwo,
	userThreeId,
	groupTwoId } = require('./fixtures/db');

beforeAll(setupDb);
beforeEach(seedDb);
afterAll(teardownDb);

describe('Groups', () => {
	describe('CREATE', () => {
		test('should create a group by a user', async (done) => {
			const response = await request(app)
				.post('/groups/')
				.set('Authorization', `Bearer ${userOne.token}`)
				.send({
					name: 'test group',
					description: 'Test description'
				})
				.expect(201);

			const member = response.body.group.members[0];
			expect(member).toEqual(userOneId.toHexString());

			done();
		});

		test('should add created group to the creators groups', async (done) => {
			const response = await request(app)
				.post('/groups/')
				.set('Authorization', `Bearer ${userOne.token}`)
				.send({
					name: 'test group',
					description: 'Test description'
				})
				.expect(201);

			const creator = response.body.group.creator;
			const userResponse = await request(app)
				.get(`/users/${creator}`)
				.expect(200);

			expect(userResponse.body.user.groups.length).toBe(1);

			done();
		});

		test('should not create a group for an unauthenticated user', async (done) => {
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

		test('should not create a group when a name is not provided', async (done) => {
			await request(app)
				.post('/groups')
				.set('Authorization', `Bearer ${userOne.token}`)
				.send({
					description: 'Test description'
				})
				.expect(422);

			done();
		});

		test('should not create a group when name is empty', async (done) => {
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
	});
	describe('READ', () => {
		test('should return a group by its id', async (done) => {
			const response = await request(app)
				.get(`/groups/${groupOneId}`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.expect(200);

			const group = response.body.group;
			expect(group.admins).toBeDefined();

			done();
		});

		test('should not return a group for an unauthenticated user', async (done) => {
			await request(app)
				.get(`/groups/${groupOneId}`)
				.set('Authorization', `Bearer ${userOne.token}1`)
				.expect(403);

			done();
		});

		test('should return a group given a user id', async (done) => {
			await request(app)
				.get(`/groups/users/${userOneId}`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.expect(200);

			done();
		});
	});

	describe('UPDATE', () => {
		test('should add a member to the group', async (done) => {
			const response = await request(app)
				.post(`/groups/${groupOneId}/members/${userTwoId}`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.expect(200);

			expect(response.body.group.members).toEqual(expect.arrayContaining([userTwoId.toHexString()]));
			done();
		});

		test('should not add a member to the group if it is already in the group', async (done) => {
			await request(app)
				.post(`/groups/${groupOneId}/members/${userOneId}`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.expect(422);

			done();
		});

		test('should not add a member if adding user is not an admin', async (done) => {
			await request(app)
				.post(`/groups/${groupOneId}/members/${userOneId}`)
				.set('Authorization', `Bearer ${userTwo.token}`)
				.expect(401);

			done();
		});

		test('should remove a member from the group', async (done) => {
			const response = await request(app)
				.delete(`/groups/${groupOneId}/members/${userThreeId}`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.send()
				.expect(200);

			done();

			expect(response.body.group).not.toEqual(expect.arrayContaining([userThreeId.toHexString()]));
		});

		test('should be able to exit the group', async (done) => {
			const response = await request(app)
				.delete(`/groups/${groupOneId}/members/me`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.send()
				.expect(200);

			expect(response.body.group).not.toEqual(expect.arrayContaining([userOneId.toHexString()]));
			done();
		});

		test('should make a user admin', async (done) => {
			const response = await request(app)
				.post(`/groups/${groupOneId}/admins/${userThreeId}`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.expect(200);

			expect(response.body.group.admins).toEqual(expect.arrayContaining([userOneId.toHexString()], userThreeId.toHexString()));

			done();
		});

		test('should not make a user admin if it is not a member', async (done) => {
			await request(app)
				.post(`/groups/${groupOneId}/admins/${userTwoId}`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.expect(422);
			done();
		});

		test('should not make a user admin if it is already an admin', async (done) => {
			await request(app)
				.post(`/groups/${groupOneId}/admins/${userTwoId}`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.expect(422);
			done();
		});

		test('should resign as admin', async (done) => {
			const response = await request(app)
				.delete(`/groups/${groupOneId}/admins/me`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.send()
				.expect(200);

			expect(response.body.group.admins.length).toBe(1);
			done();
		});

		test('should not be able to resign as admin if is the only one', async (done) => {
			await request(app)
				.delete(`/groups/${groupTwoId}/admins/me`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.send()
				.expect(401);

			done();
		});
	});

	describe('DELETE', () => {
		test('should delete a group', async (done) => {
			await request(app)
				.delete(`/groups/${groupOneId}`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.send()
				.expect(200);

			done();
		});

		test('should delete a group from creator groups array when deleting group', async (done) => {
			await request(app)
				.delete(`/groups/${groupOneId}`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.send()
				.expect(200);

			const userOneRes = await request(app)
				.get(`/users/${userOneId}`)
				.expect(200);

			expect(userOneRes.body.user.groups.length).toBe(0);

			done();
		});

		test('should delete a group from members when deleting a group', async (done) => {
			await request(app)
				.delete(`/groups/${groupOneId}`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.send()
				.expect(200);

			const userTwoRes = await request(app)
				.get(`/users/${userTwoId}`)
				.expect(200);

			expect(userTwoRes.body.user.groups.length).toBe(0);
			done();
		});

		test('should not accept a delete request from a user with no admin privileges', async (done) => {
			await request(app)
				.delete(`/groups/${groupOneId}`)
				.set('Authorization', `Bearer ${userTwo.token}`)
				.send()
				.expect(401);

			done();
		});
	});

});
