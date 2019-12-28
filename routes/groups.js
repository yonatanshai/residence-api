const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups');
// const authenticate = require('../middleware/auth/check-auth');
const authenticate = require('../middleware/auth/check-auth');
const authorize = require('../middleware/auth/authorize');
const { check } = require('express-validator');

// router.use(authenticate);

router.get('/:gid', authenticate, groupsController.getGroupById);
router.get('/users/:uid', authenticate, groupsController.getGroupsByUserId);
router.post(
	'/',
	[check('name').trim().notEmpty()],
	authenticate,
	groupsController.createGroup
);
router.post('/:gid/members/:uid', authorize, groupsController.addMember);

router.post('/:gid/admins/:uid', authorize, groupsController.makeAdmin);

router.delete('/:gid/members/me', authenticate, groupsController.exitGroup);
router.delete('/:gid/members/:uid', authorize, groupsController.removeMember);
router.delete('/:gid/admins/me', authorize, groupsController.resignAsAdmin);
router.delete('/:gid', authorize, groupsController.deleteGroup);

module.exports = router;
