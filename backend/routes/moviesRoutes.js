const express = require('express')
const router = express.Router()
const {getMovies, createMovie, updateMovie, deleteMovie, updateLikes, updateLessLikes} = require('../controllers/moviesControllers')
const {protect} = require('../middleware/authMiddleware')


router.get('/', protect, getMovies)
router.post('/', protect, createMovie)

router.put('/:id', protect, updateMovie)
router.put('/likes/:id', protect, updateLikes)
router.put('/likes_less/:id', protect, updateLessLikes)
router.delete('/:id', protect, deleteMovie)

module.exports = router