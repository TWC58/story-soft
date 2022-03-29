const Top5List = require('../models/top5list-model');
const CommentController = require('../controllers/comment-controller');
const AggregateTop5ListController = require('../controllers/aggregate-top5list-controller');
const auth = require('../auth')
const Comment = require('../models/comment-model');

createTop5List = (req, res) => {
    auth.verify(req, res, async function () {
        const body = req.body;
        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a Top 5 List',
            })
        }

        body.userId = req.userId;//store the ID in the body

        const top5List = new Top5List(body);
        console.log("creating top5List: " + JSON.stringify(top5List));
        if (!top5List) {
            console.log("CREATION OF TOP5LIST FAILED!")
            return res.status(400).json({ success: false, error: err })
        }

        // AggregateTop5ListController.update(top5List); this should actually go in update and only be called when first published

        top5List
            .save()
            .then(() => {
                return res.status(201).json({
                    success: true,
                    top5List: top5List,
                    message: 'Top 5 List Created!'
                })
            })
            .catch(error => {
                console.log(error);
                return res.status(400).json({
                    error,
                    message: 'Top 5 List Not Created!'
                })
            })
    });
}

updateTop5List = async (req, res) => {
    auth.verify(req, res, async function () {
        const body = req.body
        console.log("updateTop5List: " + JSON.stringify(body));
        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body to update',
            })
        }

        Top5List.findOne({ _id: req.params.id, userId: req.userId }, (err, top5List) => {
            console.log("ID " + req.params.id + " top5List found: " + JSON.stringify(top5List));
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'Top 5 List not found!',
                })
            }

            top5List.name = body.name
            top5List.items = body.items

            if (top5List.published === null && body.published !== null) {
                //case where the user has just published the list
                AggregateTop5ListController.update(top5List);
                console.log("Published is " + body.published);
                top5List.published = body.published;
            }

            top5List
                .save()
                .then(() => {
                    console.log("SUCCESS!!!");
                    return res.status(200).json({
                        success: true,
                        id: top5List._id,
                        message: 'Top 5 List updated!',
                    })
                })
                .catch(error => {
                    console.log("FAILURE: " + JSON.stringify(error));
                    return res.status(404).json({
                        error,
                        message: 'Top 5 List not updated!',
                    })
                })
        })
    });
}

deleteTop5List = async (req, res) => {
    auth.verify(req, res, async function () {
        //changed to findOne below from findById
        Top5List.findOne({ _id: req.params.id, userId: req.userId }, (err, top5List) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'Top 5 List not found!',
                })
            }
            if (!top5List) {
                return res.status(404).json({
                    err,
                    message: 'Top 5 List not found!',
                })
            }
            if (top5List.published) {
                //case where the aggregate list needs updating
                console.log(top5List + "THIS IS THE CURRENT LIST IN DELETE");
                AggregateTop5ListController.handleDelete(top5List);
            }
            Top5List.findOneAndDelete({ _id: req.params.id, userId: req.userId }, () => {
                return res.status(200).json({ success: true, data: top5List })
            }).catch(err => {
                console.log(err)
                return res.status(401).json({ success: false, errorMessage: "DENIED" })
            })
        })
    });
}

getTop5ListById = async (req, res) => {
    //Removed auth from this since a guest should be able to view a list
    await Top5List.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (list === null) {
            console.log("LIST NOT FOUND!");
            return res.status(401).json({ success: false, top5List: list });
        }
        return res.status(200).json({ success: true, top5List: list });
    }).catch(err => console.log(err));
}

getMyTop5Lists = async (req, res) => {
    auth.verify(req, res, async function () {
        await Top5List.find({ userId: req.userId }, async (err, top5Lists) => {
            console.log("User " + req.userId + " had requested their personal lists.\n");

            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!top5Lists.length) {
                return res.status(200).json({ success: true, data: [] })
            }

            let updatedLists = [];
            //get the comments for each list
            for (let i = 0; i < top5Lists.length; i++) {
                await Comment.find({ listId: top5Lists[i]._id }, (err, comments) => {
                    if (err) {
                        console.log(err);
                    }
                    const list = top5Lists[i];
                    updatedLists.push({
                        _id: list._id,
                        userId: list.userId,
                        username: list.username,
                        name: list.name,
                        items: list.items,
                        likes: list.likes,
                        dislikes: list.dislikes,
                        published: list.published,
                        views:  list.views,
                        createdAt: list.createdAt,
                        comments: (comments) ? comments : []
                    });

                    if (i === top5Lists.length - 1) {
                        console.log("Personal lists sent to: " + updatedLists + "!\n");

                        return res.status(200).json({ success: true, data: updatedLists })
                    }
                }).catch(err => console.log(err))
            }

        }).catch(err => console.log(err))
    });
}

getAllPublishedTop5Lists = async (req, res) => {
    
    await Top5List.find({ published: { $ne: null } }, async (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists.length) {
            return res.status(200).json({ success: true, data: [] })
        }

        let updatedLists = [];
        //get the comments for each list
        for (let i = 0; i < top5Lists.length; i++) {
            await Comment.find({ listId: top5Lists[i]._id }, (err, comments) => {
                if (err) {
                    console.log(err);
                }
                const list = top5Lists[i];
                updatedLists.push({
                    _id: list._id,
                    userId: list.userId,
                    username: list.username,
                    name: list.name,
                    items: list.items,
                    likes: list.likes,
                    dislikes: list.dislikes,
                    published: list.published,
                    views:  list.views,
                    createdAt: list.createdAt,
                    comments: (comments) ? comments : []
                });

                if (i === top5Lists.length - 1) {
                    return res.status(200).json({ success: true, data: updatedLists })
                }
            }).catch(err => console.log(err))
        }

    }).catch(err => console.log(err))
    
}

getTop5ListsByUser = async (req, res) => {
    await Top5List.find({ username:{ $regex: new RegExp("^" + req.params.username + "$", "i") }, published: { $ne: null } }, async (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        let updatedLists = [];
        if (top5Lists.length === 0)
            return res.status(200).json({ success: true, data: [] });
        //get the comments for each list
        for (let i = 0; i < top5Lists.length; i++) {
            await Comment.find({ listId: top5Lists[i]._id }, (err, comments) => {
                if (err) {
                    console.log(err);
                }
                const list = top5Lists[i];
                updatedLists.push({
                    _id: list._id,
                    userId: list.userId,
                    username: list.username,
                    name: list.name,
                    items: list.items,
                    likes: list.likes,
                    dislikes: list.dislikes,
                    published: list.published,
                    views:  list.views,
                    createdAt: list.createdAt,
                    comments: (comments) ? comments : []
                });

                if (i === top5Lists.length - 1) {
                    return res.status(200).json({ success: true, data: updatedLists })
                }
            }).catch(err => console.log(err))
        }
        
        console.log("FOUND LISTS FOR USER " + req.params.username + ": " + top5Lists);
    }).catch(err => console.log(err));
}

getTop5Lists = async (req, res) => {
    await Top5List.find({ }, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Top 5 Lists not found` })
        }
        return res.status(200).json({ success: true, data: top5Lists })
    }).catch(err => console.log(err));
}

viewList = async (req, res) => {
    await Top5List.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (list === null) {
            console.log("LIST NOT FOUND!");
            return res.status(401).json({ success: false, top5List: list });
        }

        list.views = list.views + 1;

        list
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: top5List._id,
                    message: 'Top 5 List views!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Top 5 List not viewed!',
                })
            })

        return res.status(200).json({ success: true });
    }).catch(err => console.log(err));
}

getListIds = (lists) => {
    let ids = [];

    list.forEach((list) => {
        ids.push(list._id);
    })

    return ids;
}

module.exports = {
    createTop5List,
    updateTop5List,
    deleteTop5List,
    getMyTop5Lists,
    getAllPublishedTop5Lists,
    getTop5Lists,
    getTop5ListById,
    getTop5ListsByUser,
    viewList
}