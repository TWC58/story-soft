const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const PostSchema = new Schema(
    {   
        published: { type: Date, required: false },
        name: { type: String, required: false },
        rootSection: { type: ObjectId, required: true },
        summary: { type: String, required: false },
        userData: { 
            userId: { type: ObjectId, required: false },
            username: { type: String, required: false }
        },
        tags: { type: [String], required: false},
        likes: { type: Number, required: false },
        dislikes: { type: Number, required: false },
    },
    { timestamps: true },
)

module.exports = mongoose.model('StoryPost', PostSchema)