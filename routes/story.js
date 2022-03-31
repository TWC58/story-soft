const express = require("express");

const StoryPostController = require('../controllers/story-post-controller')
const CommentController = require('../controllers/comment-controller')

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

//report post request
router.put("/reportPost", (req, res) => {
    res.json("report post")
});

//get section request
router.get("/getSection", (req, res) => {
    res.json("get section")
});

//create comment request
router.post("/createcomment", CommentController.createComment);

router.post("/replycomment", CommentController.replyComment);

//send feedback request
router.get("/sendFeedback", (req, res) => {
    res.json("send feedback")
});

module.exports = router;