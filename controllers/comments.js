const { validationResult } = require('express-validator');

const Comment = require('../models/comment');
const Post = require('../models/post');

const createComment = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ error: 'Invalid input' });
	}

	const { text } = req.body;
	const postId = req.params.postId;
	const userId = req.userData.userId;

	const createdComment = new Comment({
		text,
		creator: userId,
		post: postId,
		createdAt: new Date(),
		likes: [],
		replies: []
	});

	try {
		await createdComment.save();
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	let post;
	try {
		post = await Post.findById(postId);
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	if (!post) {
		return res.status(404).send({ error: 'post not found'});
	}

	post.comments.push(createdComment);
	await post.save();

	return res.status(201).json({ post: createdComment.toObject({ getters: true }) });
};

const getCommentsForPost = async (req, res) => {
	const postId = req.params.postId;

	let comments;
	try {
		comments = await Comment.find({ post: postId });
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	if (!comments) {
		return res.status(404).send({ error: 'No comments found' });
	}

	if (comments.length === 0) {
		return res.status(404).send({ error: 'No comments found' });
	}

	return res.json({ comments: comments.map((post) => post.toObject({ getters: true })) });
};

const getCommentById = async (req, res) => {
	const commentId = req.params.commentId;

	let comment;
	try {
		comment = await Comment.findById(commentId);
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ error: error.message });
	}

	if (!comment) {
		return res.status(404).send({ error: 'Comment not found' });
	}

	return res.json({ comment: comment.toObject({ getters: true }) });
};

const editCommentText = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ error: 'Invalid input' });
	}
	const userId = req.userData.userId;
	const commentId = req.params.commentId;

	let comment;
	try {
		comment = await Comment.findOneAndUpdate({ _id: commentId, creator: userId }, { text: req.body.text }, { new: true });
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	if (!comment) {
		return res.status(404).send({ error: 'Comment not found' });
	}

	return res.json({ comment: comment.toObject({ getters: true }) });
};

const deleteComment = async (req, res) => {
	const commentId = req.params.commentId;
	const userId = req.userData.userId;

	let deletedComment;
	try {
		deletedComment = await Comment.deleteOne({ _id: commentId, creator: userId });
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	if (deletedComment.deletedCount === 0) {
		return res.status(404).send({ error: 'Comment not found or user is not the creator' });
	}

	return res.send({ message: 'post deleted' });
};

module.exports = {
	createComment,
	getCommentById,
	getCommentsForPost,
	editCommentText,
	deleteComment
};
