const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LikeSchema = new Schema(
    {
        like: { type: Boolean, required: true },
        userId: { type: String, required: true },
        listId: { type: String, required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Like', LikeSchema)