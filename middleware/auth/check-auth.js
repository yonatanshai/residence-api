const jwt = require('jsonwebtoken');

// const User = require('../../models/user');
const User = require('../../models/user');

module.exports = async (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}
	try {
		const token = req.headers.authorization.split(' ')[1];

		if (!token) {
			// console.log('token not found');
			return res.status(401).send({ error: 'User not found' });
		}
		const decodedToken = jwt.verify(token, process.env.JWT_KEY);
		const user = await User.findById(decodedToken.userId);

		if (!user) {
			return res.status(401).send({ error: 'User not found' });
		}

		req.userData = {
			userId: decodedToken.userId
		};
		next();
	} catch (error) {
		// console.log(error);
		return res.status(403).send({ error: 'Authentication required' });
	}
};
