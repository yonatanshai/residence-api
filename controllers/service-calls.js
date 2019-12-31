const { validationResult } = require('express-validator');
// const User = require('../models/user');
// const Group = require('../models/group');
const ServiceCall = require('../models/service-call');
const Group = require('../models/group');
const { isAdmin, findGroupById } = require('./util/groups');
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
		console.log(serviceCall);
		return res.status(500).send({ error: error.message });
	}

	if (!serviceCall) {
		return res.status(404).send({ error: 'Service Call not found' });
	}

	return res.json({ serviceCall: serviceCall.toObject({ getters: true }) });
};

const getAllServiceCallsForGroup = async (req, res) => {
	const groupId = req.params.groupId;

	let serviceCalls;
	try {
		serviceCalls = await ServiceCall.find({ group: groupId });
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	if (!serviceCalls) {
		return res.status(404).send({ error: 'Service Calls not found' });
	}

	return res.json({ serviceCalls: serviceCalls.map((serviceCall) => serviceCall.toObject({ getters: true })) });
};

const getAllMyServiceCalls = async (req, res) => {
	const userId = req.userData.userId;

	let serviceCalls;
	try {
		serviceCalls = await ServiceCall.find({ creator: userId });
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}

	if (!serviceCalls) {
		return res.status(404).send({ error: 'Service Calls not found' });
	}

	return res.json({ serviceCalls: serviceCalls.map((serviceCall) => serviceCall.toObject({ getters: true })) });
};

const updateServiceCallStatus = async (req, res) => {
	const serviceCallId = req.params.serviceCallId;

	const { status } = req.body;

	let serviceCall;
	try {
		serviceCall = await ServiceCall.findById(serviceCallId);
	} catch (error) {
		console.log(serviceCall);
		return res.status(500).send({ error: error.message });
	}

	if (!serviceCall) {
		return res.status(404).send({ error: 'Service Call not found' });
	}

	const result = await findGroupById(serviceCall.group);

	if (!result.group) {
		return res.status(result.code).send({ message: result.message });
	}

	if (!isAdmin(result.group, req.userData.userId)) {
		return res.status(401).send({ error: 'Must be an admin to change service call status' });
	}

	serviceCall.status = status;

	await serviceCall.save();

	return res.json({ serviceCall: serviceCall.toObject({ getters: true }) });
}

const deleteServiceCall = async (req, res) => {
	const callId = req.params.serviceCallId;

	let serviceCall;
	try {
		serviceCall = await ServiceCall.findById(callId);
	} catch (error) {
		console.log(serviceCall);
		return res.status(500).send({ error: error.message });
	}

	if (!serviceCall) {
		return res.status(404).send({ error: 'Service Call not found' });
	}

	if (!serviceCall.creator === req.userData.userId) {
		return res.status(401).send({ error: 'Must ber creator to delete service call' });
	}

	await serviceCall.remove();

	return res.send({ message: 'service call removed' });
};


module.exports = {
	createServiceCall,
	getServiceCallById,
	getAllServiceCallsForGroup,
	getAllMyServiceCalls,
	deleteServiceCall,
	updateServiceCallStatus
};

