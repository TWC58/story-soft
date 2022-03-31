const express = require("express");

const StoryPostController = require('../controllers/story-post-controller')
const CommentController = require('../controllers/comment-controller')
const StoryTagController = require('../controllers/story-tag-controller')
const SectionController = require('../controllers/section-controller')

const router = express.Router();

//create post request
router.post("/createpost", StoryPostController.createPost);

//update post request
router.put("/updatePost", StoryPostController.updatePost);

//delete post request
router.delete("/deletePost", StoryPostController.deletePost);

//get post request
router.get("/getPost/:id", StoryPostController.getPost);

//get posts request
router.post("/getPosts", StoryPostController.getPosts);

//like post request
router.post("/likePost/:id", StoryPostController.likePost);

//get section request
router.get("/getSection/:id", SectionController.getSection);

//create comment request
router.post("/createComment", CommentController.createComment);

//adds a comment reply
router.post("/replyComment", CommentController.replyComment);

//gets all tags for story site
router.get("/getTags", StoryTagController.getTags)

//report post request
router.put("/reportPost", (req, res) => {
    res.json("report post")
});

//send feedback request
router.get("/sendFeedback", (req, res) => {
    res.json("send feedback")
});

module.exports = router;