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
    const newPost = new Posts(post)
    try {
        await newPost.save()

        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({msg: error.message})
    }
}

const updatePost = async(req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('ID no valido')

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

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
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('ID no valido')

    const post = await Posts.findById(id)
    if (!post) return res.status(404).send('No existe ese post')
    
    const updatedPost = await Posts.findByIdAndUpdate(id, {likeCount: post.likeCount + 1}, {new: true})
    res.json(updatedPost);
}
module.exports = {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    likePost
}