const ServiceCallStatus = Object.freeze({
	NEW: 'NEW',
	ASSIGNED: 'ASSIGNED',
	REFERRED_TO_PROFESSIONAL: 'REFERRED_TO_PROFESSIONAL',
	CLOSED_UNRESOLVED: 'CLOSED_UNRESOLVED',
	RESOLVED: 'RESOLVED'
});

const ServiceCallCategory = Object.freeze({
	LIGHTS: 'LIGHTS',
	BILLS: 'BILLS',
	PLUMBING: 'PLUMBING',
	DEBTS: 'DEBTS',
	ELECTRICITY: 'ELECTRICITY',
	PESTS: 'PESTS',
	OTHER: 'OTHER'
});

module.exports = {
	ServiceCallStatus,
	ServiceCallCategory
}
