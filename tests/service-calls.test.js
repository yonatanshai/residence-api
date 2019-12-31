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
	groupTwoId,
	serviceCallOne,
	serviceCallOneId } = require('./fixtures/db');
const { ServiceCallStatus, ServiceCallCategory } = require('../models/enums/service-calls');

beforeAll(setupDb);
beforeEach(seedDb);
afterAll(teardownDb);

describe('Service Calls', () => {
	describe('CREATE', () => {
		test('should create a new service call', async (done) => {
			await request(app)
				.post(`/service-calls/${groupOneId}`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.send({
					title: 'title',
					description: 'the first description',
					category: ServiceCallCategory.OTHER
				})
				.expect(201);

			done();
		});

		test('should not create a new service call by a non member user', async (done) => {
			await request(app)
				.post(`/service-calls/${groupOneId}`)
				.set('Authorization', `Bearer ${userTwo.token}`)
				.send({
					title: 'title',
					description: 'the first description',
					category: ServiceCallCategory.OTHER
				})
				.expect(401);

			done();
		});

		test('should not create a new service call if group is not found', async (done) => {
			await request(app)
				.post(`/service-calls/${groupOneId}1`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.send({
					title: 'title',
					description: 'the first description',
					category: ServiceCallCategory.OTHER
				})
				.expect(404);

			done();
		});
	});

	describe('READ', () => {
		test('should get a service call by id', async (done) => {
			await request(app)
				.get(`/service-calls/${serviceCallOneId}`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.expect(200);

			done();
		});

		test('should get all service calls for a group', async (done) => {
			const response = await request(app)
				.get(`/service-calls/groups/${groupOneId}`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.expect(200);

			expect(response.body.serviceCalls.length).toBe(1);

			done();
		});

		test('should get all service calls for requesting user', async (done) => {
			const response = await request(app)
				.get('/service-calls/me')
				.set('Authorization', `Bearer ${userOne.token}`)
				.expect(200);

			expect(response.body.serviceCalls.length).toBe(1);

			done();
		});
	});

	describe('UPDATE', () => {
		test('should update a service call status', async (done) => {
			const response = await request(app)
				.patch(`/service-calls/${serviceCallOneId}/status`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.send({
					status: ServiceCallStatus.ASSIGNED
				})
				.expect(200);

			expect(response.body.serviceCall.status).toEqual(ServiceCallStatus.ASSIGNED);

			done();
		});
	});

	describe('DELETE', () => {
		test('should delete a service call', async (done) => {
			await request(app)
				.delete(`/service-calls/${serviceCallOneId}`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.send()
				.expect(200);

			done();
		});
	});

});
