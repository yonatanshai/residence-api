const mongoose = require('mongoose');
const Comment = require('./comment');


const postSchema = mongoose.Schema({
	text: {
		type: String,
		required: true
	},
	creator: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	group: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'Group'
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
	comments: [{
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'Comment'
	}]
});

postSchema.pre('remove', async function (next) {
	await Comment.deleteMany(
		{ post: this._id }
	).exec();

	next();
});

module.exports = mongoose.model('Post', postSchema);
