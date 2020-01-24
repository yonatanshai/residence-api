const mongoose = require('mongoose');

const connect = async(cb = null) => {
	try {
		await mongoose.connect(
			process.env.DB_CONNECTION_STRING,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true
			}
		);
		if (cb) {
			cb();
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports = connect;

