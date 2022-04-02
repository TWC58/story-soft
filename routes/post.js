const express = require("express");

const PostController = require('../controllers/post-controller')
const CommentController = require('../controllers/comment-controller')
const TagController = require('../controllers/tag-controller')
const SectionController = require('../controllers/section-controller')

const router = express.Router();

//create post request
router.post("/:postType/createpost", PostController.createPost);

//update post request
router.put("/:postType/updatePost/:id", PostController.updatePost);

//get post request
router.get("/:postType/getPost/:id", PostController.getPost);

//get posts request
router.post("/:postType/getPosts", PostController.getPosts);

//delete post request
router.delete("/:postType/deletePost", PostController.deletePost);

//like post request
router.post("/:postType/likePost/:id", PostController.likePost);

//gets all tags for story site
router.get("/:postType/getTags", TagController.getTags)

//get section request
router.get("/getSection/:id", SectionController.getSection);

//create comment request
router.post("/createComment", CommentController.createComment);

//adds a comment reply
router.post("/replyComment", CommentController.replyComment);


//report post request
router.put("/reportPost", (req, res) => {
    res.json("report post")
});

//send feedback request
router.get("/sendFeedback", (req, res) => {
    res.json("send feedback")
});

module.exports = router;
