const Group = require('../../models/group');

const findGroupById = async (groupId) => {
	let group;
	try {
		group = await Group.findById(groupId);
	} catch (error) {
		return {
			group: null,
			code: 500,
			message: error.message
		};
	}

	if (!group) {
		return {
			group: null,
			code: 404,
			message: 'Group not found'
		};
	}

	return {
		group,
		code: 200
	};
};

const isAdmin = async (group, userId) => {
	return group.admins.some((admin) => admin.toString() === userId.toString());
};

module.exports = {
	findGroupById,
	isAdmin
};
