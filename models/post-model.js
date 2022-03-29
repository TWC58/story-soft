const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const PostSchema = new Schema(
    {   
        _id: { type: ObjectId, required: true },
        published: { type: Date, required: false },
        name: { type: String, required: true },
        rootSection: { type: ObjectId, required: true },
        summary: { type: String, required: false },
        userData: { 
            userId: { type: ObjectId, required: true },
            username: { type: String, required: true }
        },
        tags: { type: [String], required: true},
        likes: { type: Number, required: false },
        dislikes: { type: Number, required: false },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Post', PostSchema)
