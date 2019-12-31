const express = require('express');

const authenticate = require('../middleware/auth/check-auth');
const isMember = require('../middleware/auth/is-group-member');
const authorize = require('../middleware/auth/authorize');
// const authorize = require('../middleware/auth/authorize');
const { check } = require('express-validator');
const controller = require('../controllers/service-calls');

const router = express.Router();

// TODO: figure out routing order conflict (me and service calls id)

// get all requests for group
router.get('/groups/:groupId', authenticate, isMember, controller.getAllServiceCallsForGroup);
router.get('/me', authenticate, controller.getAllMyServiceCalls);
router.get('/:serviceCallId', authenticate, controller.getServiceCallById);

router.post(
	'/:groupId',
	[
		check('title').trim().notEmpty(),
		check('description').isLength({ min: 10, max: 240 })
	],
	authenticate,
	isMember,
	controller.createServiceCall);
router.patch('/:serviceCallId/status', authenticate, controller.updateServiceCallStatus);
router.delete('/:serviceCallId', authenticate, controller.deleteServiceCall);


module.exports = router;

