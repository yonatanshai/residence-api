const request = require('supertest');
const app = require('../app');

const {
	postOneId,
	userOneId,
	userTwo,
	userOne,
	groupOneId,
	setupDb,
	seedDb,
	teardownDb
} = require('./fixtures/db');

beforeAll(setupDb);
beforeEach(seedDb);
afterAll(teardownDb);

describe('Posts', () => {
	describe('CREATE', () => {
		test('should create a new post', async (done) => {
			await request(app)
				.post(`/groups/${groupOneId}/posts`)
				.set('Authorization', `Bearer ${userOne.token}`)
				.send({
					text: 'new post test'
				})
				.expect(201);

			done();
		});

		test('should not create a new post by non member', async (done) => {
			await request(app)
				.post(`/groups/${groupOneId}/posts`)
				.set('Authorization', `Bearer ${userTwo.token}`)
				.send({
					text: 'new post test'
				})
				.expect(401);

			done();
		});
	});

	describe('READ', () => {
		describe('controller.post.getAllPostsForGroup', () => {
			test('should get all posts for group', async (done) => {
				await request(app)
					.get(`/groups/${groupOneId}/posts`)
					.set('Authorization', `Bearer ${userOne.token}`)
					.expect(200);
				done();
			});
		});

		describe('controller.post.getAllPostsForUser', () => {
			test('should get all posts for current user', async (done) => {
				await request(app)
					.get('/groups/1/posts/me')
					.set('Authorization', `Bearer ${userOne.token}`)
					.expect(200);

				done();
			});

			test('should return a 404 if user has no posts', async (done) => {
				await request(app)
					.get('/groups/1/posts/me')
					.set('Authorization', `Bearer ${userTwo.token}`)
					.expect(404);

				done();
			});
		});

		describe('controller.post.getPostById', () => {
			test('should return a post by its id', async (done) => {
				await request(app)
					.get(`/groups/${groupOneId}/posts/${postOneId}`)
					.set('Authorization', `Bearer ${userOne.token}`)
					.expect(200);

				done();
			});

			test('should return 404 for postId that does not exist', async (done) => {
				await request(app)
					.get(`/groups/${groupOneId}/posts/${userOneId}`)
					.set('Authorization', `Bearer ${userOne.token}`)
					.expect(404);

				done();
			});
		});


	});

	describe('UPDATE', () => {
		describe('controller.post.likePost', () => {
			test('should add like to post\'s likes array', async (done) => {
				const response = await request(app)
					.post(`/groups/${groupOneId}/posts/${postOneId}/likes`)
					.set('Authorization', `Bearer ${userOne.token}`)
					.send()
					.expect(200);

				expect(response.body.post.likes.length).toBe(2);

				done();
			});

			test('should not add like when is already liked by the user', async (done) => {
				await request(app)
					.post(`/groups/${groupOneId}/posts/${postOneId}/likes`)
					.set('Authorization', `Bearer ${userTwo.token}`)
					.send()
					.expect(401);

				done();
			});
		});
		describe('controller.post.editPostText', () => {
			test('should replace post\'s text with newText ', async (done) => {
				const newText = 'edited text';
				const response = await request(app)
					.patch(`/groups/${groupOneId}/posts/${postOneId}`)
					.set('Authorization', `Bearer ${userOne.token}`)
					.send({
						text: newText
					})
					.expect(200);

				expect(response.body.post.text).toEqual(newText);
				done();
			});

			test('should not edit a post if not creator', async (done) => {
				const newText = 'edited text';
				await request(app)
					.patch(`/groups/${groupOneId}/posts/${postOneId}`)
					.set('Authorization', `Bearer ${userTwo.token}`)
					.send({
						text: newText
					})
					.expect(404);

				done();
			});

			test('should not edit a post if provided text is empty', async (done) => {
				await request(app)
					.patch(`/groups/${groupOneId}/posts/${postOneId}`)
					.set('Authorization', `Bearer ${userOne.token}`)
					.send({
						text: '  '
					})
					.expect(422);
				done();
			});
		});
	});
	describe('DELETE', () => {
		describe('controller.post.deletePost', () => {
			test('should delete a post from db', async (done) => {
				await request(app)
					.delete(`/groups/${groupOneId}/posts/${postOneId}`)
					.set('Authorization', `Bearer ${userOne.token}`)
					.send()
					.expect(200);
				done();
			});

			test('should not delete a post if the user is not the creator', async (done) => {
				await request(app)
					.delete(`/groups/${groupOneId}/posts/${postOneId}`)
					.set('Authorization', `Bearer ${userTwo.token}`)
					.send()
					.expect(404);
				done();
			});
		});
		describe('controller.post.unlikePost', () => {
			test('should unlike a post', async (done) => {
				const response = await request(app)
					.delete(`/groups/${groupOneId}/posts/${postOneId}/likes`)
					.set('Authorization', `Bearer ${userTwo.token}`)
					.send()
					.expect(200);
				expect(response.body.post.likes.length).toBe(0);
				done();
			});

			test('should not unlike a post if is not liked before', async (done) => {
				await request(app)
					.delete(`/groups/${groupOneId}/posts/${postOneId}/likes`)
					.set('Authorization', `Bearer ${userOne.token}`)
					.send()
					.expect(422);
				done();
			});
		});
	});
});
