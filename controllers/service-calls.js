const { validationResult } = require('express-validator');
// const User = require('../models/user');
// const Group = require('../models/group');
const ServiceCall = require('../models/service-call');
const { ServiceCallStatus } = require('../models/enums/service-calls');

const createServiceCall = async (req, res) => {
	console.log('service call called');
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ error: 'Invalid input' });
	}

	const userId = req.userData.userId;
	const groupId = req.params.groupId;

	const { title, description, category } = req.body;

	const createdServiceCall = new ServiceCall({
		title,
		description,
		status: ServiceCallStatus.NEW,
		category,
		creator: userId,
		group: groupId
	});

	try {
		await createdServiceCall.save();
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}
	return res.status(201).json({ serviceCall: createdServiceCall.toObject({ getters: true }) });
};

const getServiceCallById = async (req, res) => {
	const callId = req.params.serviceCallId;

	let serviceCall;
	try {
		serviceCall = await ServiceCall.findById(callId);
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	if (!serviceCall) {
		return res.status(404).send({ error: 'Service Call not found' });
	}

	return res.json({ serviceCall: serviceCall.toObject({ getters: true }) });
};

module.exports = {
	createServiceCall,
	getServiceCallById
};

