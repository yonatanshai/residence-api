const Group = require('../../models/group');

module.exports = async (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}
	const groupId = req.params.groupId;
	const userId = req.userData.userId;

	console.log(groupId);

	let group;
	try {
		group = await Group.findOne({_id: groupId, members: userId});
	} catch (error) {
		return res.status(404).send({ error: 'group not found' });
	}

	if (!group) {
		return res.status(401).send({ error: 'must be a member to create a service call' });
	}

	next();
};
