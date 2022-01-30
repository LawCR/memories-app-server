const mongoose = require('mongoose')

const PostsSchema = mongoose.Schema(
    {
        title: String,
        message: String,
        name: String,
        creator: String,
        tags: Array,
        selectedFile: String,
        likes: {
            type: [String],
            default: []
        },
        createdAt: {
            type: Date,
            default: new Date()
        }
    }
)

module.exports = mongoose.model("Posts", PostsSchema)