const express = require('express');
const { check } = require('express-validator');

const commentsRoutes = require('./comments');
const router = express.Router({ mergeParams: true });

router.get('/', () => { });
router.get('/me', () => { });
router.get('/:postId');

router.post('/', () => { });

router.patch('/:postId', () => {});

router.delete('/:postId', () => {});

router.use('/:postId/comments', commentsRoutes);


module.exports = router;
