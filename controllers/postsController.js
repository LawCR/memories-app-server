const Posts = require("../models/Posts")
const mongoose = require('mongoose')

const getPosts = async(req, res) => {
    try {
        const posts = await Posts.find()
        res.status(200).json(posts)
    } catch (error) {
        res.status(409).json({msg: error.message})
    }
}

const createPost = async(req, res) => {
    const post = req.body 
    const newPost = new Posts({...post, creator: req.userId, createdAt: new Date().toISOString()})
    try {
        await newPost.save()

        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({msg: error.message})
    }
}

const updatePost = async(req, res) => {
    const { id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('ID no valido')

    const updatedPost = { ...post, _id: id };

    await Posts.findByIdAndUpdate(id, updatedPost, { new: true });
    
    res.json(updatedPost);
}

const deletePost = async(req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('ID no valido')

    await Posts.findByIdAndRemove(id)

    res.json({ message: 'Post eliminado exitosamente!'})

}

const likePost = async(req, res) => {
    const { id } = req.params;
    if (!req.userId) return res.json({message: 'Usuario no Autenticado'})
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('ID no valido')

    const post = await Posts.findById(id)
    const index = post.likes.findIndex((id) => id === String(req.userId))

    if (index === -1) {
        // like de post
        post.likes.push(req.userId)
    } else {
        // dislike de post
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }
    
    const updatedPost = await Posts.findByIdAndUpdate(id, post , {new: true})
    res.status(200).json(updatedPost);
}
module.exports = {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    likePost
}