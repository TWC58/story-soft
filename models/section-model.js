const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const SectionSchema = new Schema(
    {   
        name: { type: String, required: false },
        parent: { type: ObjectId, required: false },
        children: { type: [ObjectId], required: false },
        comments: { type: [ObjectId], required: false },
        data: { type: JSON, required: true, default: ""}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Section', SectionSchema)
