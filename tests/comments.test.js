const request = require('supertest');
const app = require('../app');

const {
	userOne,
	userOneId,
	postOneId,
	commentOneId,
	seedDb,
	setupDb,
	teardownDb
} = require('./fixtures/db');

beforeAll(setupDb);
beforeEach(seedDb);
afterAll(teardownDb);

describe('Comments', () => {
	describe('CREATE', () => {
		describe('controller.comment.createComment', () => {
			test('should create a new comment', async (done) => {
				const response = await request(app)
					.post(`/groups/1/posts/${postOneId}/comments`)
					.set('Authorization', `Bearer ${userOne.token}`)
					.send({
						text: 'new comment test text'
					})
					.expect(201);

				done();
			});
		});
	});
	describe('READ', () => {
		describe('controller.comment.getCommentsForPost', () => {
			test('should get all comments for post', async (done) => {
				const response = await request(app)
					.get(`/groups/1/posts/${postOneId}/comments`)
					.set('Authorization', `Bearer ${userOne.token}`)
					.expect(200);

				expect(response.body.comments.length).toBe(1);
				done();
			});
			test('controller.comment.getCommentById', async (done) => {
				await request(app)
					.get(`/groups/1/posts/${postOneId}/comments/${commentOneId}`)
					.set('Authorization', `Bearer ${userOne.token}`)
					.expect(200);
				done();
			});
		});

	});
	describe('UPDATE', () => {
		describe('controller.comment.editCommentText', () => {
			test('should replace comment text by newText', async (done) => {
				const newText = 'edited text';
				const response = await request(app)
					.patch(`/groups/1/posts/${postOneId}/comments/${commentOneId}`)
					.set('Authorization', `Bearer ${userOne.token}`)
					.send({
						text: newText
					})
					.expect(200);

				expect(response.body.comment.text).toEqual(newText);
				done();
			});
		});
	});
	describe('DELETE', () => {
		describe('controller.comment.deleteComment', () => {
			test('should delete a comment given its id', async (done) => {
				await request(app)
					.delete(`/groups/1/posts/${postOneId}/comments/${commentOneId}`)
					.set('Authorization', `Bearer ${userOne.token}`)
					.expect(200);
				done();
			});
		});
	});
});
