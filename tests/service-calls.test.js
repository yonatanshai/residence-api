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
	});

	describe('READ', () => {
		test('should get a service call by id for a member user', async (done) => {
			await request(app)
				.get(`/service-calls/${serviceCallOneId}`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.expect(200);

			done();
		});
	});

});
