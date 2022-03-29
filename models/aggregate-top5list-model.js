const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AggregateTop5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        itemVotes: { type: [Number], required: true },
        likes: { type: Number, required: true },
        dislikes: { type: Number, required: true },
        updated: { type: Date, required: true },
        views:  { type: Number, required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('AggregateTop5List', AggregateTop5ListSchema)
