const express = require('express')
const router = express.Router()
const {createUser, signinUser, dataUser} = require('../controllers/usersControllers')
const {protect} = require('../middleware/authMiddleware')

router.post('/', createUser)
router.post('/signin', signinUser)
router.get('/mydata', protect, dataUser)




module.exports = router
