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
		console.log(error.message);
		return res.status(500).send({ error: error.message });
	}

	if (!group) {
		console.log('must be a member to create a service call');
		return res.status(401).send({ error: 'must be a member to create a service call' });
	}

	next();
};
