const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema(
    {
        username: { type: String, required: true },
        message: { type: String, required: true },
        reply: {
            username: { type: String, required: false },
            message: { type: String, required: false }
        }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Comment', CommentSchema)
