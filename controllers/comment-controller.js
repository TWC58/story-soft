const auth = require('../auth')
const Comment = require('../models/comment-model');

postComment = async (req, res) => {
    auth.verify(req, res, async function () {

        const body = req.body;
        body.userId = req.userId;

        let comment = new Comment(body);

        if (!comment) {
            console.log("CREATION OF LIST FAILED!")
            return res.status(400).json({ success: false, error: err })
        }

        comment
            .save()
            .then(() => {
                return res.status(201).json({
                    success: true,
                    comment: comment,
                    message: 'Comment Created!'
                })
            })
            .catch(error => {
                console.log(error);
                return res.status(400).json({
                    error,
                    message: 'Comment Not Created!'
                })
            })
    });
}

getCommentsByListId = async function(listId) {
    await Comment.find({ listId: listId }, (err, comments) => {
        if (err) {
            console.log(err);
            return [];
        }

        return comments;
    }).then((result) => {
        return result;
    }).catch(err => console.log(err))
}

module.exports = {
    postComment,
    getCommentsByListId
}