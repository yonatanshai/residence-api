const mongoose = require('mongoose');
const Reply = require('./reply');
const Post = require('./post');

const commentSchema = mongoose.Schema({
	text: {
		type: String,
		required: true
	},
	creator: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	post: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'Post'
	},
	likes: [{
		count: {
			type: Number,
			required: true
		},
		user: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: 'User'
		}
	}],
	replies: [{
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'Reply'
	}]
});

commentSchema.pre('remove', async function (next) {
	await Post.updateOne(
		{ _id: this.post },
		{ $pull: { comments: this._id } }
	).exec();

	await Reply.deleteMany(
		{ comment: this._id }
	).exec();

	next();
});

module.exports = mongoose.model('Comment', commentSchema);