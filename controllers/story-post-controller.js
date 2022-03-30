const passport = require('passport');
require('../passport-setup');
const Post = require('../models/post-model');
const User = require('../models/user-model');
const SectionController = require('../controllers/section-controller');
const TagController = require('../controllers/tag-controller');

const SearchBy = {
    AUTHOR: "AUTHOR",
    TITLE: "TITLE",
    TAG: "TAG",
    NONE: "NONE"
}

createPost = async (req, res) => {
    auth.verify(req, res, async function () {
        const user = await User.findOne({ _id: req.userId });
        const rootSection = SectionController.createSection();

        const post = new Post({
            published: null,
            name: "Untitled",
            rootSection: rootSection._id,
            summary: "",
            userData: { 
                userId: req.userId,
                username: user.username
            },
            tags: [],
            likes: 0,
            dislikes: 0,
        });

        if (!post) {
            console.log("CREATION OF POST FAILED!")
            return res.status(400).json({ success: false, error: err })
        }

        post
            .save()
            .then(() => {
                return res.status(201).json({
                    success: true,
                    post: post,
                    message: 'Post Created!'
                })
            })
            .catch(error => {
                console.log(error);
                return res.status(400).json({
                    error,
                    message: 'Post Not Created!'
                })
            })
    });
}

updatePost = async (req, res) => {
    auth.verify(req, res, async function () {
        const body = req.body

        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body to update',
            })
        }

        Post.findOne({ _id: req.params.id, userId: req.userId }, (err, post) => {
            console.log("ID " + req.params.id + " post found: " + JSON.stringify(post));
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'Post not found!',
                })
            }

            //update the tags in the database based on the new tags
            //but only if the story is already published, otherwise we don't care what tags it has
            if (post.published) {
                //note, this may not actually be a feature implemented in the client side (may not be able to update tags on published post)
                TagController.processTags(post, body.tags);
            }

            post.published = body.published;
            post.name = body.name;
            post.summary = body.summary;
            post.tags = body.tags;
            //things not updatable from here: rootSection, userData, and likes and dislikes counts

            if (!post.published && body.published) {
                //case where the user has just published the post
                //handle any updating of tags or other publishing issues
                TagController.processTags(post, body.tags);
            }

            post
                .save()
                .then(() => {
                    console.log("SUCCESS!!!");
                    return res.status(200).json({
                        success: true,
                        id: post._id,
                        message: 'Post updated!',
                    })
                })
                .catch(error => {
                    console.log("FAILURE: " + JSON.stringify(error));
                    return res.status(404).json({
                        error,
                        message: 'Post not updated!',
                    })
                })
        })
    });
}

getPosts = async (req, res) => {
    auth.verify(req, res, async function () {

        const body = req.body;

        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body to search',
            })
        }

        const search = body.search;
        const searchBy = body.searchBy;

        let posts = null;

        switch (searchBy) {
            case (SearchBy.AUTHOR):
                posts = this.getPostsByAuthor(search);
                break;
            case (SearchBy.TITLE):
                posts = this.getPostsByTitle(search);
                break;
            case (SearchBy.TAG):
                posts = this.getPostsByTag(search);
                break;
            case (SearchBy.NONE):
                posts = this.getAllPosts();
                break;
            default:
                return res.status(400).json({
                    success: false,
                    error: 'You must provide a valid searchBy'
                })
        }

        return res.status(200).json({ success: true, data: posts });
    });
}

deletePost = async (req, res) => {

}

//not exposed via router
getPostsByAuthor = (search) => {
    //TODO
}

//not exposed via router
getPostsByTitle = (search) => {
    //TODO
}

//not exposed via router
getPostsByTag = (search) => {
    //TODO
}

//not exposed via router
getAllPosts = (search) => {
    //TODO
}

module.exports = {
    createPost,
    updatePost,
    getPosts,
    deletePost
}