const mongoose = require('mongoose');
const { ServiceCallStatus, ServiceCallCategory } = require('../models/enums/service-calls');

const serviceCallSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum:
			[
				ServiceCallStatus.NEW,
				ServiceCallStatus.ASSIGNED,
				ServiceCallStatus.REFERRED_TO_PROFESSIONAL,
				ServiceCallStatus.CLOSED_UNRESOLVED,
				ServiceCallStatus.RESOLVED
			],
		required: true,
		default: ServiceCallStatus.NEW
	},
	category: {
		type: String,
		enum:
			[
				ServiceCallCategory.BILLS,
				ServiceCallCategory.PLUMBING,
				ServiceCallCategory.DEBTS,
				ServiceCallCategory.ELECTRICITY,
				ServiceCallCategory.LIGHTS,
				ServiceCallCategory.PESTS,
				ServiceCallCategory.OTHER
			],
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
	}
});

module.exports = mongoose.model('ServiceCall', serviceCallSchema);
