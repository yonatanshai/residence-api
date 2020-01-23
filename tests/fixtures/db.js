const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {MongoMemoryServer} = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const Group = require('../../models/group');
const User = require('../../models/user');
const ServiceCall = require('../../models/service-call');
const Post = require('../../models/post');
const Comment = require('../../models/comment');
const { ServiceCallStatus, ServiceCallCategory } = require('../../models/enums/service-calls');


const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();
const userThreeId = new mongoose.Types.ObjectId();
const userFourId = new mongoose.Types.ObjectId();
const groupOneId = new mongoose.Types.ObjectId();
const groupTwoId = new mongoose.Types.ObjectId();
const serviceCallOneId = new mongoose.Types.ObjectId();
const postOneId = new mongoose.Types.ObjectId();
const commentOneId = new mongoose.Types.ObjectId();

// const ids = [userOneId, userTwoId, userThreeId, userFourId, groupOneId, groupTwoId, serviceCallOneId];


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

const userFour = {
	_id: userFourId,
	name: 'User 4',
	email: 'test4@test.com',
	// password: userOneHashedPassword,
	password: '12345678',
	token: jwt.sign({ userId: userFourId, email: 'test4@test.com' }, process.env.JWT_KEY, { expiresIn: '1h' })
};

const groupOne = {
	_id: groupOneId,
	name: 'test group',
	createdAt: new Date(),
	creator: userOneId,
	admins: [userOneId, userFourId],
	members: [userOneId, userThreeId]
};

const groupTwo = {
	_id: groupTwoId,
	name: 'test group',
	createdAt: new Date(),
	creator: userOneId,
	admins: [userOneId],
	members: [userOneId, userThreeId]
};

const postOne = {
	_id: postOneId,
	text: 'post one',
	creator: userOneId,
	group: groupOneId,
	createdAt: new Date(),
	likes: [userTwoId],
	comments: []
};

const serviceCallOne = {
	_id: serviceCallOneId,
	title: 'service call one',
	description: 'service call one description',
	status: ServiceCallStatus.NEW,
	category: ServiceCallCategory.OTHER,
	creator: userOneId,
	group: groupOneId
};

const commentOne = {
	_id: commentOneId,
	text: 'Comment one',
	creator: userOneId,
	post: postOne,
	createdAt: new Date(),
	likes: [],
	replies: []
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

		mongoose.connection.once('open', async () => {
			await User.deleteMany();
			await Group.deleteMany();
			await ServiceCall.deleteMany();
			console.log(`MongoDB successfully connected to ${mongoUri}`);
		});
	});


};

const seedDb = async () => {
	await User.deleteMany();
	await Group.deleteMany();
	await ServiceCall.deleteMany();
	await Post.deleteMany();
	await Comment.deleteMany();

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

	await new User({
		...userFour,
		password: await bcrypt.hash('12345678', 12)
	}).save();

	await new Group(groupOne).save();
	await new Group(groupTwo).save();

	await new ServiceCall(serviceCallOne).save();

	await new Post(postOne).save();

	await new Comment(commentOne).save();
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
	userThree,
	userFour,
	userFourId,
	groupTwoId,
	serviceCallOne,
	serviceCallOneId,
	postOneId,
	postOne,
	commentOneId
};
