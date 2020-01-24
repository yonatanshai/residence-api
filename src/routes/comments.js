const express = require('express');
const { check } = require('express-validator');

const controller = require('../controllers/comments');
const authenticate = require('../middleware/auth/check-auth');

const router = express.Router({ mergeParams: true });

router.get('/', authenticate, controller.getCommentsForPost);
router.get('/:commentId', authenticate, controller.getCommentById);
router.post('/', [check('text').trim().notEmpty()], authenticate, controller.createComment);
router.patch('/:commentId', [check('text').trim().notEmpty()], authenticate, controller.editCommentText);
router.delete('/:commentId', authenticate, controller.deleteComment);

module.exports = router;
