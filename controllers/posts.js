const { validationResult } = require('express-validator');

const Post = require('../models/post');

const createPost = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ error: 'Invalid input' });
	}

	const { text } = req.body;
	const groupId = req.params.groupId;
	const userId = req.userData.userId;

	const createdPost = new Post({
		text,
		creator: userId,
		group: groupId,
		createdAt: new Date(),
		likes: [],
		comments: []
	});

	try {
		await createdPost.save();
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	return res.status(201).json({ post: createdPost.toObject({ getters: true }) });
};

const getAllPostsForGroup = async (req, res) => {
	const groupId = req.params.groupId;

	let posts;
	try {
		posts = await Post.find({ group: groupId });
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	if (!posts) {
		return res.status(404).send({ error: 'No posts found' });
	}

	if (posts.length === 0) {
		return res.status(404).send({ error: 'No posts found' });
	}

	return res.json({ posts: posts.map((post) => post.toObject({ getters: true })) });
};

const getAllMyPosts = async (req, res) => {
	const userId = req.userData.userId;

	let posts;
	try {
		posts = await Post.find({ creator: userId });
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	if (!posts) {
		return res.status(404).send({ error: 'No posts found' });
	}

	if (posts.length === 0) {
		return res.status(404).send({ error: 'No posts found' });
	}

	return res.json({ posts: posts.map((post) => post.toObject({ getters: true })) });
};

const getPostById = async (req, res) => {
	const postId = req.params.postId;

	let post;
	try {
		post = await Post.findById(postId);
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ error: error.message });
	}

	if (!post) {
		return res.status(404).send({ error: 'Post not found' });
	}

	return res.json({ post: post.toObject({ getters: true }) });
};

const likePost = async (req, res) => {
	const postId = req.params.postId;
	let post;
	try {
		post = await Post.findById(postId);
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ error: error.message });
	}

	if (!post) {
		return res.status(404).send({ error: 'Post not found' });
	}

	const newLike = req.userData.userId;

	const isAlreadyLiked = post.likes.some((like) => like === newLike);

	if (isAlreadyLiked) {
		return res.status(422).send({ error: 'This post is already liked by this user' });
	}

	post.likes.push(newLike);

	const updatedPost = await post.save();

	return res.json({ post: updatedPost.toObject({ getters: true }) });
};

const unlikePost = async (req, res) => {
	const postId = req.params.postId;
	const userId = req.userData.userId;

	let post;
	try {
		post = await Post.findById(postId);
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ error: error.message });
	}

	if (!post) {
		return res.status(404).send({ error: 'Post not found' });
	}

	const likeIndex = post.likes.findIndex((like) => like.toString() === userId.toString());

	if (likeIndex === -1) {
		return res.status(422).send({ error: 'Cannot unlike a post that was not liked' });
	}

	post.likes.splice(likeIndex, 1);

	await post.save();

	return res.json({ post: post.toObject({ getters: true }) });
};

const editPostText = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ error: 'Invalid input' });
	}
	const userId = req.userData.userId;
	const postId = req.params.postId;

	let post;
	try {
		post = await Post.findOneAndUpdate({ _id: postId, creator: userId }, { text: req.body.text }, { new: true });
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	if (!post) {
		return res.status(404).send({ error: 'Post not found' });
	}

	return res.json({ post: post.toObject({ getters: true }) });
};

const deletePost = async (req, res) => {
	const postId = req.params.postId;
	const userId = req.userData.userId;

	let deletedPost;
	try {
		deletedPost = await Post.deleteOne({ _id: postId, creator: userId });
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}


	if (deletedPost.deletedCount === 0) {
		return res.status(404).send({ error: 'Post not found or user is not the creator' });
	}

	return res.send({ message: 'post deleted' });
};


module.exports = {
	createPost,
	getAllPostsForGroup,
	getAllMyPosts,
	getPostById,
	likePost,
	editPostText,
	deletePost,
	unlikePost
};
