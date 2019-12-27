const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups');
// const checkAuth = require('../middleware/auth/check-auth');
const checkAuth = require('../middleware/auth/check-auth');
const { check } = require('express-validator');

// router.use(checkAuth);

router.get('/:gid', checkAuth, groupsController.getGroupById);
router.get('/users/:uid', checkAuth, groupsController.getGroupsByUserId);
router.post(
	'/',
	[check('name').trim().notEmpty()],
	checkAuth,
	groupsController.createGroup
);

router.patch('/', () => {

});

router.delete('/:gid', checkAuth, groupsController.deleteGroup);

module.exports = router;
