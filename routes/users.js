const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/users');

router.get('/', userController.getAllUsers);
router.get('/:uid', userController.getUserById);
router.post(
	'/signup',
	[
		check('name').notEmpty(),
		check('email').normalizeEmail().isEmail(),
		check('password').isLength({ min: 8 })
	],
	userController.createUser);
router.post('/login', userController.login);

module.exports = router;
