const mongoose = require('mongoose')

const PostsSchema = mongoose.Schema(
    {
        title: String,
        message: String,
        creator: String,
        tags: Array,
        selectedFile: String,
        likeCount: {
            type: Number,
            default: 0
        }  
    },
    {timestamps: true}
)

module.exports = mongoose.model("Posts", PostsSchema)