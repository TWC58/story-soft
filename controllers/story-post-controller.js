const passport = require('passport');
require('../passport-setup');
const auth = require('./user-controller')
const StoryPost = require('../models/story-post-model');
const User = require('../models/user-model');
const SectionController = require('../controllers/section-controller');
const StoryTagController = require('./story-tag-controller');

const SearchBy = {
    AUTHOR: "AUTHOR",
    TITLE: "TITLE",
    TAG: "TAG",
    NONE: "NONE"
}

const LikeType = {
    LIKE: "LIKE",
    DISLIKE: "DISLIKE"
}

createPost = async (req, res) => {
    auth.isLoggedIn(req, res, async function () {
        const user = await User.findOne({ _id: req.user.userId });
        const rootSection = SectionController.createSection();

        const post = new StoryPost({
            published: null,
            name: "Untitled",
            rootSection: rootSection._id,
            summary: "",
            userData: { 
                userId: req.user.userId,
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
    auth.isLoggedIn(req, res, async function () {
        const body = req.body

        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body to update',
            })
        }

        StoryPost.findOne({ _id: req.params.id, userId: req.user.userId }, (err, post) => {
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
                StoryTagController.processTags(post, body.tags);
            }

            post.published = body.published;
            post.name = body.name;
            post.summary = body.summary;
            post.tags = body.tags;
            //things not updatable from here: rootSection, userData, and likes and dislikes counts

            if (!post.published && body.published) {
                //case where the user has just published the post
                //handle any updating of tags or other publishing issues
                StoryTagController.processTags(post, body.tags);
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

getPost = async (req, res) => {
    auth.isLoggedIn(req, res, async function () {

        const id = req.params.id;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'You must provide an id to search',
            })
        }

        StoryPost.findOne({_id: id}, (err, post) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            if (post === null) {
                console.log("POST NOT FOUND!");
                return res.status(401).json({ success: false, post: post });
            }
    
            return res.status(200).json({ success: true, post: post });
        });

    });
}

getPosts = async (req, res) => {
    auth.isLoggedIn(req, res, async function () {

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
                posts = await this.getPostsByAuthor(search);
                break;
            case (SearchBy.TITLE):
                posts = await this.getPostsByTitle(search);
                break;
            case (SearchBy.TAG):
                posts = await this.getPostsByTag(search);
                break;
            case (SearchBy.NONE):
                posts = await this.getAllPosts();
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
    auth.isLoggedIn(req, res, async function () {
        StoryPost.findOne({ _id: req.params.id, userId: req.user.userId }, (err, post) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'Post not found!',
                })
            }
            if (!post) {
                return res.status(404).json({
                    err,
                    message: 'Post not found!',
                })
            }
            if (post.published) {
                //case where the tags need to be processed to remove the post
                StoryTagController.processTags(post, []);
            }
            StoryPost.findOneAndDelete({ _id: req.params.id, userId: req.user.userId }, () => {
                return res.status(200).json({ success: true, data: post })
            }).catch(err => {
                console.log(err)
                return res.status(401).json({ success: false, errorMessage: "DENIED" })
            })
        })
    });
}

likePost = async (req, res) => {
    auth.isLoggedIn(req, res, async function () {
        StoryPost.findOne({ _id: req.params.id }, (err, post) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'Post not found!',
                })
            }
            if (!post) {
                return res.status(404).json({
                    err,
                    message: 'Post not found!',
                })
            }
            if (!post.published) {
                //case where the user is attempting to like an unpublished post
                return res.status(404).json({
                    err,
                    message: 'Cannot like unpublished post!',
                })
            }
            //otherwise we have a valid like situation
            //need to find the user liking
            User.findOne({_id: req.user.userId}, (err, user) => {
                //FOUR CASES TO CONSIDER

                //case the user has no like for this post and is liking
                if (!user.likes.includes(post._id) && !user.dislikes.includes(post._id) && req.body.like === LikeType.LIKE) {
                    //add to user's likes
                    user.likes.push(post._id);
                    user.save();
                    //now we need to add a like to the post
                    post.likes += 1;
                    post.save();
                    return res.status(200).json({
                        success: true
                    });
                } else if (!user.likes.includes(post._id) && !user.dislikes.includes(post._id) && req.body.like === LikeType.DISLIKE) {
                    //case where the user has no dislike for this post and is disliking
                    //add to user's dislikes
                    user.dislikes.push(post._id);
                    user.save();
                    //now we need to add a dislike to the post
                    post.dislikes += 1;
                    post.save();
                    return res.status(200).json({
                        success: true
                    });
                } else if (user.likes.includes(post._id) && !user.dislikes.includes(post._id) && req.body.like === LikeType.DISLIKE) {
                    //case where the user is disliking a post they have liked
                    //add to user's dislikes
                    user.dislikes.push(post._id);
                    //remove from their likes
                    user.likes.splice(user.likes.indexOf(post._id), 1);
                    user.save();
                    
                    post.likes -= 1;
                    post.dislikes += 1;
                    post.save();
                    return res.status(200).json({
                        success: true
                    });
                } else if (!user.likes.includes(post._id) && user.dislikes.includes(post._id) && req.body.like === LikeType.LIKE) {
                    //case where the user is liking a post they have disliked
                    //add to user's likes
                    user.likes.push(post._id);
                    //remove from their dislikes
                    user.dislikes.splice(user.dislikes.indexOf(post._id), 1);
                    user.save();
                    
                    post.dislikes -= 1;
                    post.likes += 1;
                    post.save();
                    return res.status(200).json({
                        success: true
                    });
                } else {
                    //case where the user is liking a post already liked or disliking a post already disliked
                    return res.status(400).json({
                        success: false,
                        message: 'Liking or disliking an already liked/disliked post improperly. ACTION FAILED.'
                    });
                }
            });
        })
    });
}

//not exposed via router
getPostsByAuthor = async (search) => {
    const posts = await StoryPost.find({'userData.username': { $regex: new RegExp("^" + search + "$", "i") }});
    return posts;
}

//not exposed via router
getPostsByTitle = async (search) => {
    const posts = await StoryPost.find({name: { $regex: new RegExp("^" + search + "$", "i") }});
    return posts;
}

//not exposed via router
getPostsByTag = async (search) => {
    const postIds = await StoryTagController.getPostIdsByTag(search);
    const posts = [];

    postIds.array.forEach(id => {
        const post = StoryPost.findOne({_id: id});
        posts.push(post);
    });

    return posts;
}

//not exposed via router
getAllPosts = async (search) => {
    return await StoryPost.find({published: { $ne: null }});//sends only posts whos published field is non-null
}

module.exports = {
    createPost,
    updatePost,
    getPosts,
    deletePost,
    getPost,
    likePost
}