const Posts = require("../models/Posts")
const mongoose = require('mongoose')

const getPosts = async(req, res) => {
    const { page } = req.query
    try {
        const LIMIT = 8
        // obtener el index de la pagina segun el numero de pagina
        const startIndex = (Number(page) - 1) * LIMIT
        // Obtener el total de posts que hay para calcular cuantas paginas de 8 habrá
        const total = await Posts.countDocuments({})
        // Obtener los posts(8) ordenado por los mas nuevos ignorando los que no esten en esos 8
        const posts = await Posts.find().sort({_id: -1}).limit(LIMIT).skip(startIndex)
        res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)})
    } catch (error) {
        res.status(409).json({msg: error.message})
    }
}

const getPost = async(req, res) => {
    const { id } = req.params
    try {
        const post = await Posts.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(409).json({msg: error.message})
    }
}

const PostsBySearch = async(req, res) => {
    const { searchQuery, tags } = req.query
    try {
        // Nos permite que palabras como Test,TEST,test las cuente como las mismas
        const title = new RegExp(searchQuery, 'i')
        // Mostrar todos los posts que coincidan con el title o en su defecto por algun tag
        const posts = await Posts.find({ $or: [ {title }, { tags: {$in: tags.split(',')} } ] })
        res.status(200).json({data: posts})
    } catch (error) {
        res.status(404).json({msg: error.message})
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
    likePost,
    PostsBySearch,
    getPost
}