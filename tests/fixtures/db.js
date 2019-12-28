const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {MongoMemoryServer} = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const Group = require('../../models/group');
const User = require('../../models/user');


const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();
const userThreeId = new mongoose.Types.ObjectId();
const groupOneId = new mongoose.Types.ObjectId();

const userOne = {
	_id: userOneId,
	name: 'Test user',
	email: 'test@test.com',
	// password: userOneHashedPassword,
	password: '12345678',
	// groups: [groupOneId],
	token: jwt.sign({ userId: userOneId, email: 'test@test.com' }, process.env.JWT_KEY, { expiresIn: '1h' })
};

const userTwo = {
	_id: userTwoId,
	name: 'Test user',
	email: 'test2@test.com',
	// password: userOneHashedPassword,
	password: '12345678',
	token: jwt.sign({ userId: userTwoId, email: 'test2@test.com' }, process.env.JWT_KEY, { expiresIn: '1h' })
};

const userThree = {
	_id: userThreeId,
	name: 'User 3',
	email: 'test3@test.com',
	// password: userOneHashedPassword,
	password: '12345678',
	token: jwt.sign({ userId: userThreeId, email: 'test3@test.com' }, process.env.JWT_KEY, { expiresIn: '1h' })
};

const groupOne = {
	_id: groupOneId,
	name: 'test group',
	createdAt: new Date(),
	creator: userOneId,
	admins: [userOneId],
	members: [userOneId, userThreeId]
};

let mongoServer;


const setupDb = async () => {
	mongoServer = new MongoMemoryServer();

	mongoose.Promise = Promise;
	mongoServer.getUri().then((mongoUri) => {
		const mongooseOpts = {
			// options for mongoose 4.11.3 and above
			useNewUrlParser: true,
			useUnifiedTopology: true
		};
		const retryStr = 'retryWrites=false';
		const newUri = mongoUri.concat(retryStr);
		mongoose.connect(newUri, mongooseOpts);

		mongoose.connection.on('error', (e) => {
			if (e.message.code === 'ETIMEDOUT') {
				console.log(e);
				mongoose.connect(mongoUri, mongooseOpts);
			}
			console.log(e);
		});

		mongoose.connection.once('open', () => {
			console.log(`MongoDB successfully connected to ${mongoUri}`);
		});
	});


};

const seedDb = async () => {
	await User.deleteMany();
	await Group.deleteMany();

	await new User({
		...userOne,
		password: await bcrypt.hash('12345678', 12)
	}).save();

	await new User({
		...userTwo,
		password: await bcrypt.hash('12345678', 12)
	}).save();

	await new User({
		...userThree,
		password: await bcrypt.hash('12345678', 12)
	}).save();

	await new Group(groupOne).save();
};

const teardownDb = async () => {
	await mongoose.disconnect();
	await mongoServer.stop();

};

module.exports = {
	userOne,
	groupOne,
	setupDb,
	userOneId,
	groupOneId,
	seedDb,
	teardownDb,
	userTwo,
	userTwoId,
	userThreeId,
	userThree
};
