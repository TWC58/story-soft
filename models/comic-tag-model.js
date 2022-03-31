const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const TagSchema = new Schema(
    {
        name: { type: String, required: true },
        posts: { type: [ObjectId], required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('ComicTag', TagSchema)