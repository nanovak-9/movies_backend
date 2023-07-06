const mongoose = require('mongoose')

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Name of movie']
    },
    overview: {
        type: String,
        required: [true, 'Summary of movie']
    },
    likes: {
        type: Number,
        min: 0,
        default: 0
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Movie', movieSchema)
