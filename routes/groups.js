const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups');
const postsRoutes = require('./posts');
const serviceCallRoutes = require('./service-calls');
// const authenticate = require('../middleware/auth/check-auth');
const authenticate = require('../middleware/auth/check-auth');
const authorize = require('../middleware/auth/authorize');
const { check } = require('express-validator');

// router.use(authenticate);

router.get('/:groupId', authenticate, groupsController.getGroupById);
router.get('/users/:uid', authenticate, groupsController.getGroupsByUserId);
router.post(
	'/',
	[check('name').trim().notEmpty()],
	authenticate,
	groupsController.createGroup
);
router.post('/:groupId/members/:uid', authorize, groupsController.addMember);

router.post('/:groupId/admins/:uid', authorize, groupsController.makeAdmin);

router.delete('/:groupId/members/me', authenticate, groupsController.exitGroup);
router.delete('/:groupId/members/:uid', authorize, groupsController.removeMember);
router.delete('/:groupId/admins/me', authorize, groupsController.resignAsAdmin);
router.delete('/:groupId', authorize, groupsController.deleteGroup);

// Nested routes
router.use('/:groupId/posts/', postsRoutes);
router.use('/:groupId/service-calls', serviceCallRoutes);

module.exports = router;
