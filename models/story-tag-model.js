const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const StoryTagSchema = new Schema(
    {
        _id: { type: ObjectId, required: true },
        name: { type: String, required: true },
        posts: { type: [ObjectId], required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('StoryTag', StoryTagSchema)