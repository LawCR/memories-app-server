const express = require("express");
const { getPosts, createPost, updatePost, deletePost, likePost } = require("../controllers/postsController");
const { authValidation } = require("../middleware/auth");


const router = express.Router()

router.get('/', getPosts)

router.post('/', authValidation, createPost)

router.patch('/:id', authValidation, updatePost)

router.delete('/:id', authValidation, deletePost)

router.patch('/:id/likePost', authValidation, likePost)

module.exports = router