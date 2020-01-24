const express = require('express');
const { check } = require('express-validator');

const authenticate = require('../middleware/auth/check-auth');
const isMember = require('../middleware/auth/is-group-member');
const commentsRoutes = require('./comments');
const controller = require('../controllers/posts');
const router = express.Router({ mergeParams: true });


router.get('/', authenticate, isMember, controller.getAllPostsForGroup);
router.get('/me', authenticate, controller.getAllMyPosts);
router.get('/:postId', authenticate, isMember, controller.getPostById);

router.post('/', [check('text').notEmpty()], authenticate, isMember, controller.createPost);
router.post('/:postId/likes', authenticate, isMember, controller.likePost);

router.patch('/:postId', [check('text').trim().notEmpty()], authenticate, controller.editPostText);

router.delete('/:postId', authenticate, controller.deletePost);
router.delete('/:postId/likes', authenticate, controller.unlikePost);

router.use('/:postId/comments', commentsRoutes);


module.exports = router;
