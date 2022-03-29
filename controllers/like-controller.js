const Like = require('../models/like-model')
const Top5List = require('../models/top5list-model');
const AggregateTop5List = require('../models/aggregate-top5list-model');
const auth = require('../auth')

likeList = async (req, res) => {
    auth.verify(req, res, async function () {
        await Like.findOne({ userId: req.userId, listId: req.params.id }, async (err, like) => {

            if (!like) {
                like = new Like({ like: req.body.like });
                like.userId = req.userId;
                like.listId = req.params.id;
                
                like.save()
                .catch(error => {
                    console.log(error);
                })

                console.log("Like stored: " + like);

                let dbT = (req.body.listType === "normal") ? Top5List : AggregateTop5List;

                await dbT.findOne({ _id: req.params.id }, (err, list) => {
                    if (err) {
                        return res.status(400).json({ success: false, error: err });
                    }
                    if (list === null) {
                        console.log("LIST NOT FOUND!");
                        return res.status(401).json({ success: false, top5List: list });
                    }
                    
                    if (like.like === true) {
                        list.likes = list.likes + 1;
                    } else if (!like.like) {
                        list.dislikes = list.dislikes + 1;
                    }

                    list.save()
                    .then(() => {
                        return res.status(200).json({ success: true, top5List: list, like: like });
                    })
                }).catch(err => console.log(err));
                
            } else {
                //case where the user already has a like for this list
                if (like.like !== req.body.like) {
                    //case where the user is swapping likes and dislikes
                    let dbT = (req.body.listType === "normal") ? Top5List : AggregateTop5List;
                    like.like = req.body.like;//now the like has the new like value
                    await dbT.findOne({ _id: req.params.id }, (err, list) => {
                        if (err) {
                            return res.status(400).json({ success: false, error: err });
                        }
                        if (list === null) {
                            console.log("LIST NOT FOUND!");
                            return res.status(401).json({ success: false, top5List: list });
                        }
                        
                        if (like.like === true) {
                            list.dislikes = list.dislikes - 1;
                            list.likes = list.likes + 1;
                        } else if (!like.like) {
                            list.likes = list.likes - 1;
                            list.dislikes = list.dislikes + 1;
                        }

                        like.save()
                        .then((updatedLike) => {
                            console.log("LIKE UPDATED: " + updatedLike);
                        });

                        list.save()
                        .then(() => {
                            return res.status(200).json({ success: true, top5List: list, like: like });
                        })
                    }).catch(err => console.log(err));
                }
            }
        });
    });
}

unlikeList  = async (req, res) => {
    auth.verify(req, res, async function () {
        await Like.findOne({ userId: req.userId, listId: req.params.id }, async (err, like) => {

            if (like) {

                let dbT = (req.body.listType === "normal") ? Top5List : AggregateTop5List;

                await dbT.findOne({ _id: req.params.id }, (err, list) => {
                    if (err) {
                        return res.status(400).json({ success: false, error: err });
                    }
                    if (list === null) {
                        console.log("LIST NOT FOUND!");
                        return res.status(401).json({ success: false, top5List: list });
                    }
                    
                    if (like.like === true) {
                        list.likes = list.likes - 1;
                    } else if (!like.like) {
                        list.dislikes = list.dislikes - 1;
                    }

                    console.log("Like deleted: " + like);

                    Like.findOneAndDelete({ userId: req.userId, listId: req.params.id })
                    .then((deletedLike) => {
                        if (!deletedLike) {
                            console.log("ERROR: LIKE NOT FOUND AND DELETED");
                        }
                    });

                    list.save()
                    .then(() => {
                        return res.status(200).json({ success: true, top5List: list, like: like });
                    })
                }).catch(err => console.log(err));
                
            } else {
                //case where the like doesn't already exist
                console.log("LIKE NOT FOUND!");
                return res.status(401).json({ success: false });
                    
            }
        });
    });
}

module.exports = {
    likeList,
    unlikeList
}