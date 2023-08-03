const asyncHandler = require('express-async-handler')
const Movie = require('../models/movieModel')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const {getUserId} = require('../utils/usersIndex')

const getMovies= async (req, res) => {
    const movies = await Movie.find()

    res.status(200).json(movies)
}

const createMovie= asyncHandler(async (req, res) => {
    
    if(!req.body.title || !req.body.overview){
        res.status(400)
        throw new Error('Information missing. Cannot create new movie.')
    }

    const movie = await Movie.create({
        title: req.body.title,
        overview: req.body.overview
    })
    
    res.status(201).json({movie})
})

const updateMovie= asyncHandler(async (req, res) => {

    const movie = await Movie.findById(req.params.id)

    if(!movie) {
        res.status(400)
        throw new Error('Movie was not found.')
    }

    const movieUpdated = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true})

    res.status(200).json(movieUpdated)
})

const deleteMovie= asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id)

    if(!movie) {
        res.status(400)
        throw new Error('Movie was not found.')
    }

    await movie.deleteOne()

    res.status(200).json({id: req.params.id})
})


const updateLikes = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    
    if(!movie) {
            res.status(400)
            throw new Error('Movie was not found.')
        }

    
    const user = await getUserId(req)
     

    let likes = movie.likes
    likes += 1
    
    const movieId = movie._id.valueOf()
    const foundId = user.likedMovies.find((m) => m == movieId)

    console.log('FOUND ID:', foundId)

    if(foundId == undefined) {

        user.likedMovies.push(movie._id)

        await user.updateOne({likedMovies: user.likedMovies})

        const likesUpdated = await Movie.findByIdAndUpdate(req.params.id, {likes}, {new: true})

        res.status(200).json({likesUpdated, user})

    }else {

        res.status(400)
        throw new Error('Movie is already in your list!')
        
    }  


    
})

const updateLessLikes = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    
    if(!movie) {
        res.status(400)
        throw new Error('Movie was not found.')
    }

    const user = await getUserId(req)
    

    let likes = movie.likes
    likes -= 1

    const movieId = movie._id.valueOf()

    const foundId = user.likedMovies.find((m) => m == movieId)

    if(foundId == undefined) {
        res.status(400)
        throw new Error('Movie is not in your list!')
    }    

    const movieIndex = user.likedMovies.findIndex((m) => m == movieId)

    user.likedMovies.splice(movieIndex, 1)
    await user.updateOne({likedMovies: user.likedMovies})

    const likesUpdated = await Movie.findByIdAndUpdate(req.params.id, {likes}, {new: true})

    res.status(200).json({likesUpdated, user})
})



module.exports = {
    getMovies, createMovie, updateMovie, deleteMovie, updateLikes, updateLessLikes
}