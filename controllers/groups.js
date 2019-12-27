const { validationResult } = require('express-validator');
const User = require('../models/user');
const Group = require('../models/group');


const getGroupById = async (req, res) => {
	const groupId = req.params.gid;

	let group;
	try {
		group = await Group.findById(groupId);
	} catch (error) {
		return res.status(500).send({ message: 'Error fetching a group' });
	}

	if (!group) {
		return res.status(404).send({ message: 'Group not found' });
	}

	return res.json({ group: group.toObject({ getters: true }) });
};

const getGroupsByUserId = async (req, res) => {
	const userId = req.params.uid;

	let userWithGroups;
	try {
		userWithGroups = await User.findById(userId).populate('groups');
	} catch (error) {
		return res.status(500).send({ message: 'error' });
	}

	if (!userWithGroups.groups) {
		return res.status(404).send({ message: 'groups not found' });
	}

	return res.json({ groups: userWithGroups.groups.map((g) => g.toObject({ getters: true })) });
};

const createGroup = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ error: 'Invalid input' });
	}
	const userId = req.userData.userId;
	const { name, description } = req.body;

	const createdGroup = new Group({
		name,
		description,
		createdAt: new Date().getMilliseconds(),
		creator: userId,
		admins: [userId],
		members: [userId]
	});

	let user;
	try {
		user = await User.findById(userId);
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ message: error.message });
	}

	if (!user) {
		return res.status(404).send({ message: 'User not found' });
	}

	try {
		// Right now sessions is disabled because of testing difficulties
		// const session = await mongoose.startSession();
		// session.startTransaction({writeConcern: 'w: 1'});

		// user.groups.push(createdGroup);
		// await createdGroup.save({ session });
		// // await user.save({ session });
		// await session.commitTransaction();
		await createdGroup.save();
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ message: error.message });
	}

	// try {
	// 	user.groups.push(createdGroup);
	// 	await user.save();
	// } catch (error) {
	// 	console.log(error.message);
	// 	return res.status(500).send({ message: error.message });
	// }

	res.status(201).json({ group: createdGroup });
};

const deleteGroup = async (req, res, next) => {
	const groupId = req.params.gid;

	let group;
	try {
		group = await Group.findById(groupId);
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	if (!group) {
		return res.status(404).send({ error: 'Group not found' });
	}

	try {
		await group.remove();
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	res.status(200).json({ message: 'deleted group' });
};

const addMember = async (req, res) => {
	const userId = req.params.uid;
	const groupId = req.params.gid;

	let newMember;
	try {
		newMember = await User.findById(userId);
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ error: error.message });
	}

	if (!newMember) {
		console.log('user not found');
		return res.status(404).send({ error: 'User not found' });
	}

	let group;
	try {
		group = await Group.findByIdAndUpdate(groupId, { $push: { members: newMember._id } }, { new: true });
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ error: error.message });
	}

	return res.json({ group: group.toObject({ getters: true }) });

};


module.exports = {
	getGroupsByUserId,
	createGroup,
	getGroupById,
	deleteGroup,
	addMember
};
