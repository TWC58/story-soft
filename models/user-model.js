const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const UserSchema = new Schema(
    {   
        _id: { type: ObjectId, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
        hashedPassword: { type: String, required: true },
        bio: { type: String, required: false },
        likes: { type: [ObjectId], required: false },
        dislikes: { type: [ObjectId], required: false },
        followers: { type: [ObjectId], required: false },
        following: { type: [ObjectId], required: false },
        bookmarks: { type: Map, of: ObjectId, required: false }
    },
    { timestamps: true },
)

module.exports = mongoose.model('User', UserSchema)
