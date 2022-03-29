const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema(
    {
        message: { type: String, required: true },
        userId: { type: String, required: true },
        creator: { type: String, required: true },
        listId: { type: String, required: true },
        created: { type: Number, require: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Comment', CommentSchema)
