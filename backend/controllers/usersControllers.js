const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Movie = require('../models/movieModel')
const {getUserId} = require('../utils/usersIndex')

const createUser = asyncHandler(async (req, res) => {

    const {name, email, password} = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error('Data missing.')
    }

    const userExists = await User.findOne({email})

    if(userExists) {
        res.status(400)
        throw new Error('User already exists.')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email
        })
    }else {
        res.status(400)
        throw new Error('Invalid data.')
    }
})


const signinUser = asyncHandler(async (req, res) => {
    
    const {email, password} = req.body

    const user = await User.findOne({email})

    let listOfMovies = []
      
    listOfMovies = await Movie.find({_id: user.likedMovies}, 'title overview')

    if (user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email, 
            token: generateToken(user._id),
            listOfMovies
        })
    }else {
        res.status(400)
        throw new Error('Could not validate data.')
    }
})


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}


const dataUser = asyncHandler(async (req, res) => {
    
    const user = await getUserId(req)
    const likedMovies = user.likedMovies
   
    let listOfMovies = []
      
    listOfMovies = await Movie.find({_id: likedMovies}, 'title overview poster_path')
    
    const result = {
        user: req.user,
        listOfMovies: listOfMovies
    }
    
    res.status(200).json(result)

})

module.exports = {
    createUser,
    signinUser,
    dataUser
}