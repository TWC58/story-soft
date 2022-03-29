const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        userId: { type: String, required: true },
        username: { type: String, required: true },
        name: { type: String, required: true },
        items: { type: [String], required: true },
        likes: { type: Number, required: true },
        dislikes: { type: Number, required: true },
        published: { type: Date, required: false },
        views:  { type: Number, required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
