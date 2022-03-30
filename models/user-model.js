const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const UserSchema = new Schema(
    {   
        _id: { type: ObjectId, required: true },
        googleId: {type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
        bio: { type: String, required: false },
        likes: { type: [ObjectId], required: true },
        dislikes: { type: [ObjectId], required: true },
        followers: { type: [ObjectId], required: true },
        following: { type: [ObjectId], required: true},
        bookmarks: { type: Map, of: ObjectId, required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('User', UserSchema)
