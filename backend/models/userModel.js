const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Type your full name']
    },
    email: {
        type: String,
        required: [true, 'Type your email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Create a password']
    },
    likedMovies: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)