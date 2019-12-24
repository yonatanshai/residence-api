const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups');
const checkAuth = require('../middleware/check-auth');

// router.use(checkAuth);

router.get('/user/:uid', groupsController.getGroupsByUserId);
router.post('/users/:uid', groupsController.createGroup);

router.patch('/', () => {

});

router.delete('/', () => {

});

module.exports = router;