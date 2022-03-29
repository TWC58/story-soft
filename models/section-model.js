const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const SectionSchema = new Schema(
    {   
        _id: { type: ObjectId, required: true },
        name: { type: String, required: true },
        parent: { type: ObjectId, required: false },
        children: { type: ObjectId, required: true },
        comments: { type: [ObjectId], required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Section', SectionSchema)
