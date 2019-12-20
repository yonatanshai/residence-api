const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

module.exports = router;