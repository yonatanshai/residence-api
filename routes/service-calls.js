const express = require('express');

const authenticate = require('../middleware/auth/check-auth');
const isMember = require('../middleware/auth/is-group-member');
// const authorize = require('../middleware/auth/authorize');
const { check } = require('express-validator');
const controller = require('../controllers/service-calls');

const router = express.Router();

// TODO: add middleware for isMember

// get all requests for group
router.get('/groups/:groupId', () => { });
router.get('/:serviceCallId', authenticate, controller.getServiceCallById);
router.get('/me', () => { });
router.post(
	'/:groupId',
	[
		check('title').trim().notEmpty(),
		check('description').isLength({ min: 10, max: 240 })
	],
	authenticate,
	isMember,
	controller.createServiceCall);
router.patch('/:serviceCallId', () => { });
router.delete('/:serviceCallId', () => { });


module.exports = router;

