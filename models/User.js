const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    groups: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Group'
    }]
})

module.exports = mongoose.model('User', userSchema);