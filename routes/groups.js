const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups');
const checkAuth = require('../middleware/check-auth');

// router.use(checkAuth);

router.get('/:gid', groupsController.getGroupById);
router.get('/user/:uid', groupsController.getGroupsByUserId);
router.post('/:uid', groupsController.createGroup);

router.patch('/', () => {

});

router.delete('/', () => {

});

module.exports = router;