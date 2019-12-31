const { validationResult } = require('express-validator');
const User = require('../models/user');
const Group = require('../models/group');
const {findGroupById} = require('./util/groups');

const getGroupById = async (req, res) => {
	const groupId = req.params.groupId;

	const result = await findGroupById(groupId);
	if (!result.group) {
		return res.status(result.code).send({ message: result.message });
	}

	const group = result.group;

	return res.json({ group: group.toObject({ getters: true }) });
};

const getGroupsByUserId = async (req, res) => {
	const userId = req.userData.userId;

	let userWithGroups;
	try {
		userWithGroups = await User.findById(userId).populate('groups');
	} catch (error) {
		return res.status(500).send({ message: 'error' });
	}

	if (!userWithGroups) {
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

	try {
		user.groups.push(createdGroup);
		await user.save();
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ message: error.message });
	}

	res.status(201).json({ group: createdGroup });
};

const deleteGroup = async (req, res, next) => {
	const groupId = req.params.groupId;

	const result = await findGroupById(groupId);
	if (!result.group) {
		return res.status(result.code).send({ message: result.message });
	}

	const group = result.group;

	try {
		await group.remove();
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	res.status(200).json({ message: 'deleted group' });
};

const makeAdmin = async (req, res) => {
	const groupId = req.params.groupId;
	const userId = req.params.uid;

	const result = await findGroupById(groupId);

	if (!result.group) {
		return res.status(result.code).send({ message: result.message });
	}

	const group = result.group;

	const isMember = group.members.some((member) => member.toString() === userId.toString());
	if (!isMember) {
		console.log('not a member');
		return res.status(422).send({ error: 'User must be a member to be an admin' });
	}

	const isAdmin = group.admins.some((admin) => admin.toString() === userId.toString());
	// if (isAdmin(group, userId)) {
	if (isAdmin) {
		console.log('already an admin');
		return res.status(422).send({ message: 'User is already an admin' });
	}

	group.admins.push(userId);

	let updatedGroup;
	try {
		updatedGroup = await group.save();
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	return res.json({ group: updatedGroup.toObject({ getters: true }) });
};

const addMember = async (req, res) => {
	const userId = req.params.uid;
	const groupId = req.params.groupId;

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

	const result = await findGroupById(groupId);

	if (!result.group) {
		return res.status(result.code).send({ message: result.message });
	}

	if (result.group.members.includes(newMember._id)) {
		return res.status(422).send({ error: 'User is already a member' });
	}

	result.group.members.push(newMember._id);

	const updatedGroup = result.group;

	return res.json({ group: updatedGroup.toObject({ getters: true }) });

};

const removeMember = async (req, res) => {
	let memberToRemove;
	try {
		memberToRemove = await User.findById(req.params.uid).populate('groups');
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	if (!memberToRemove) {
		return res.status(404).send({ error: 'Member not found' });
	}

	let groupToRemoveFrom;
	try {
		groupToRemoveFrom = await Group.findByIdAndUpdate(
			req.params.groupId,
			{ $pull: { members: req.params.uid } },
			{ new: true });
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	return res.json({ group: groupToRemoveFrom.toObject({ getters: true }) });
};

const exitGroup = async (req, res) => {
	const userId = req.userData.userId;
	const groupId = req.params.groupId;

	let group;
	try {
		group = await Group.findByIdAndUpdate(groupId,
			{ $pull: { members: userId, admins: userId } },
			{ new: true }
		);
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ error: error.message });
	}

	if (!group) {
		return res.status(404).send({ error: 'Group not found' });
	}

	return res.json({ group: group.toObject({ getters: true }) });
};

const resignAsAdmin = async (req, res) => {
	const userId = req.userData.userId;

	const result = await findGroupById(req.params.groupId);

	if (!result.group) {
		return res.status(result.code).send({ message: result.message });
	}

	const group = result.group;

	if (group.admins.length === 1) {
		return res.status(401).send({ error: 'A group must have at least one admin' });
	}

	const userIndex = group.admins.indexOf(userId);
	if (userIndex !== -1) {
		group.admins.splice(userIndex, 1);
	}

	return res.json({ group: group.toObject({ getters: true }) });
};

module.exports = {
	getGroupsByUserId,
	createGroup,
	getGroupById,
	deleteGroup,
	addMember,
	removeMember,
	exitGroup,
	makeAdmin,
	resignAsAdmin
};
