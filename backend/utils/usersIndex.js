const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const getUserId = async (req) => {
    
    let token = req.headers.authorization.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    let userId = decoded.id 
    const user = await User.findById(userId)
    console.log(userId, user)

    return user
}

module.exports = {getUserId}
