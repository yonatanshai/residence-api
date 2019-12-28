const mongoose = require('mongoose');
const User = require('./user');

const groupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	createdAt: {
		type: Date,
		required: true
	},
	creator: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	admins: [{
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'User'
	}],
	members: [{
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'User'
	}]
});

groupSchema.pre('save', async function (next) {
	User.updateMany(
		{ _id: this.creator },
		{ $push: { groups: this._id }}
		// {multi: false}
	).exec();

	next();
});

groupSchema.pre('remove', async function (next) {
	User.updateMany(
		{ groups: this._id },
		{ $pull: { groups: this._id } }
		// { multi: true }
	).exec();

	next();
});

module.exports = mongoose.model('Group', groupSchema);
