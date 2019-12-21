const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    admins: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    members: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }]
})

module.exports = mongoose.model('Group', groupSchema);