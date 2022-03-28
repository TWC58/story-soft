const express = require("express");

const router = express.Router();

//Home Page
router.get("/", (req, res) => {
    res.json("COMIC HOME PAGE")
});

//get profile request
router.get("/getProfile", (req, res) => {
    res.json("get profile")
});

//follow user request
router.post("/followUser", (req, res) => {
    res.json("follow user")
});

//create post request
router.post("/createPost", (req, res) => {
    res.json("create post")
});

//update post request
router.put("/updatePost", (req, res) => {
    res.json("update post")
});

//delete post request
router.delete("/deletePost", (req, res) => {
    res.json("delete post")
});

//get post request
router.get("/getPost", (req, res) => {
    res.json("get post")
});

//like post request
router.put("/likePost", (req, res) => {
    res.json("like post")
});

//report post request
router.put("/reportPost", (req, res) => {
    res.json("report post")
});

//get section request
router.get("/getSection", (req, res) => {
    res.json("get section")
});

//create comment request
router.post("/createComment", (req, res) => {
    res.json("create comment")
});

//get posts request
router.get("/getPosts", (req, res) => {
    res.json("get posts")
});

//send feedback request
router.get("/sendFeedback", (req, res) => {
    res.json("send feedback")
});

//Page Not Found
router.get("*", (req, res) => {
    res.json("Page Not Found")
});

module.exports = router;