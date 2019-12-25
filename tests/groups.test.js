const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Group = require('../models/group');
const { userOne, userOneId, groupOneId, setupDb } = require('./fixtures/db');


beforeEach(setupDb);

describe('Groups', () => {
    test('should create a group by a user', async (done) => {
        const response = await request(app)
            .post(`/groups/`)
            .set('Authorization', `Bearer ${userOne.token}`)
            .send({
                name: 'test group',
                description: 'Test description'
            })
            .expect(201);
        done();
    });

    test('should return a group by its id', async (done) => {
        const response = await request(app)
            .get(`/groups/${groupOneId}`)
            .set('Authorization', `Bearer ${userOne.token}`)
            .expect(200);

        const group = response.body.group;
        expect(group.admins).toBeDefined();

        done();
    });

    test('should return a group given a user id', async (done) => {
        await request(app)
            .get(`/groups/users/${userOneId}`)
            .set('Authorization', `Bearer ${userOne.token}`)
            .expect(200)

        done();
    });
});