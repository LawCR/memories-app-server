const express = require("express");
const { getPosts, createPost, updatePost, deletePost, likePost, PostsBySearch, getPost } = require("../controllers/postsController");
const { authValidation } = require("../middleware/auth");


const router = express.Router()

router.get('/', getPosts)

// Siempre el query antes que el param para evitar error :''v
router.get('/search', PostsBySearch)

router.get('/:id', getPost)

router.post('/', authValidation, createPost)

router.patch('/:id', authValidation, updatePost)

router.delete('/:id', authValidation, deletePost)

router.patch('/:id/likePost', authValidation, likePost)



module.exports = router