const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },
    groups: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Group'
    }]
})

module.exports = mongoose.model('User', userSchema);