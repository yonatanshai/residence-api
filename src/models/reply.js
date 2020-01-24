const mongoose = require('mongoose');
const Comment = require('./comment');

const replySchema = mongoose.Schema({
	text: {
		type: String,
		required: true
	},
	creator: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'User'
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
	comment: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'Comment'
	}
});

replySchema.pre('remove', async function (next) {
	await Comment.updateOne(
		{ _id: this.comment },
		{ $pull: { replies: this._id } }
	).exec();

	next();
});

module.exports = mongoose.model('Reply', replySchema);
