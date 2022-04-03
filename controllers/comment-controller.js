const auth = require('./user-controller')
const Comment = require('../models/comment-model');
const Section = require('../models/section-model');

createComment = (req, res) => {
    auth.isLoggedIn(req, res, async function () {

        const body = req.body;

        // Create a new comment
        let comment = new Comment({
            username: body.username,
            message: body.message,
            reply: {
                username: null,
                message: null
            }
        });
        
        if (!comment) {
            return res.status(400).json({ success: false, error: err })
        }

        // Save the comment to the database
        comment
            .save()
            .then(savedComment => {
                // Find the section where the comment is and add it to the section's comment array
                Section.findById({ _id: body.sectionId }, (err, section) => {
                    if (err) {
                        return res.status(400).json({ success: false, error: err })
                    }
                    else {
                        section.comments.push(savedComment._id);
                        section
                            .save()
                            .then(() => {
                                console.log("SUCCESS!!!");
                                return res.status(200).json({
                                    success: true,
                                    id: section._id,
                                    message: 'Section\'s comments updated!',
                                })
                            })
                    }
                })
            })
            .then(() => {
                return res.status(201).json({
                    success: true,
                    comment: comment,
                    message: 'Comment Created!'
                })
            })
            .catch( console.log("ERROR: Comment Not Created!") )
   });
}

replyComment = (req, res) => {
    auth.isLoggedIn(req, res, async function () {

        const body = req.body;

        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body to update',
            })
        }

        // Find the comment by its id and update the reply
        Comment.findById({ _id: body._id }, (err, comment) => {
            comment.reply.username = body.username;
            comment.reply.message = body.message;
            comment.
                save()
                .then(() => {
                    console.log("SUCCESS!!!");
                    return res.status(200).json({
                        success: true,
                        id: body._id,
                        message: 'Reply updated!',
                    })
                })
                // .catch(error => {
                //     console.log("FAILURE: " + JSON.stringify(error));
                //     return res.status(404).json({
                //         error,
                //         message: 'Reply not updated!',
                //     })
                // })
        })

    });
}

module.exports = {
    createComment,
    replyComment
}