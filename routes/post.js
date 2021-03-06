const express = require("express");

const PostController = require('../controllers/post-controller')
const CommentController = require('../controllers/comment-controller')
const TagController = require('../controllers/tag-controller')
const SectionController = require('../controllers/section-controller')

const router = express.Router();

//create post request
// router.post("/:postType/createpost/:userId", PostController.createPost);//TODO revert to auth
router.post("/:postType/createpost", PostController.createPost);

//update post request
// router.put("/:postType/updatePost/:id/:userId", PostController.updatePost);//TODO revert to auth
router.put("/:postType/updatePost/:id", PostController.updatePost);

//get post request
router.get("/:postType/getPost/:id", PostController.getPost);//no auth

//get posts request
router.post("/:postType/getPosts", PostController.getPosts);//no auth

//delete post request
// router.delete("/:postType/deletePost/:id/:userId", PostController.deletePost);//TODO revert to auth
router.delete("/:postType/deletePost/:id", PostController.deletePost);

//like post request
// router.post("/:postType/likePost/:id/:userId", PostController.likePost);//TODO revert to auth
router.post("/:postType/likePost/:id", PostController.likePost);

//gets all tags for story site
router.get("/:postType/getTags", TagController.getTags)

//add section request
router.post("/addSection/:id", SectionController.addSection);

//delete section request
router.delete("/deleteSection/:id", SectionController.deleteSection);

//get section request
router.get("/getSection/:id", SectionController.getSection);

//update section request
router.put("/updateSection/:id", SectionController.updateSection)

//create comment request
router.post("/createComment/:id", CommentController.createComment);

//adds a comment reply
router.post("/replyComment/:id", CommentController.replyComment);

//get comment request
router.get("/getComment/:id", CommentController.getComment);


//report post request
router.put("/reportPost", (req, res) => {
    res.json("report post")
});

//send feedback request
router.get("/sendFeedback", (req, res) => {
    res.json("send feedback")
});

module.exports = router;