const AggregateTop5List = require('../models/aggregate-top5list-model');
const auth = require('../auth')
const Comment = require('../models/comment-model');

getAggregateTop5Lists = async (req, res) => {
    await AggregateTop5List.find({ }, async (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        let updatedLists = []
        for (let i = 0; i < top5Lists.length; i++) {
            await Comment.find({ listId: top5Lists[i]._id }, (err, comments) => {
                if (err) {
                    console.log(err);
                }
                const list = top5Lists[i];
                updatedLists.push({
                    _id: list._id,
                    name: list.name,
                    items: list.items,
                    itemVotes: list.itemVotes,
                    likes: list.likes,
                    dislikes: list.dislikes,
                    updated: list.updated,
                    updatedAt: list.updatedAt,
                    views:  list.views,
                    createdAt: list.createdAt,
                    comments: (comments) ? comments : []
                });

                if (i === top5Lists.length - 1) {
                    return res.status(200).json({ success: true, data: updatedLists })
                }
            }).catch(err => console.log(err))
        }
    }).catch(err => console.log(err));
}

viewAggregateList = async (req, res) => {
    await AggregateTop5List.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (list === null) {
            console.log("LIST NOT FOUND!");
            return res.status(401).json({ success: false, top5List: list });
        }

        list.views = list.views + 1;

        list.save();

        console.log(list);

        return res.status(200).json({ success: true });
    }).catch(err => console.log(err));
}

// convertListCaps = (top5List) => {
//     top5List.
// }

update = async (top5List) => {
    await AggregateTop5List.findOne({ name: { $regex: new RegExp("^" + top5List.name + "$", "i") } }, (err, aggregateTop5List) => {
        if (err) {
            console.log(err);
            return;
        }
        if (!aggregateTop5List) {
            //case where there was no existing aggregate list
            //so we must create a new aggregate list
            aggregateTop5List = new AggregateTop5List({
                name: top5List.name,
                items: top5List.items,
                itemVotes: [5, 4, 3, 2, 1],
                likes: 0,
                dislikes: 0,
                updated: new Date(),
                views:  0
            });
            //aggregate is saved below else
        } else {
            //case where we found an existing aggregate
            top5List.items.forEach(function(item, index, array) {
                let aggregateItemIndex = aggregateTop5List.items.findIndex(aggItem => {
                    return aggItem.toLowerCase() === item.toLowerCase();
                });
                if (aggregateItemIndex < 0) {
                    //case where the aggregate item doesn't exist
                    let itemStartVote = 5 - index;
                    let itemInsertionIndex = 0;
                    while (itemInsertionIndex < aggregateTop5List.itemVotes.length && aggregateTop5List.itemVotes[itemInsertionIndex] > itemStartVote) {
                        itemInsertionIndex++;
                    }
                    aggregateTop5List.items.splice(itemInsertionIndex, 0, item);
                    aggregateTop5List.itemVotes.splice(itemInsertionIndex, 0, 5 - index);
                    //the items and votes are still sorted after insertion
                } else {
                    //case where the aggregate already exists
                    //update the current score
                    let newScore = aggregateTop5List.itemVotes[aggregateItemIndex] + 5 - index;
                    aggregateTop5List.itemVotes[aggregateItemIndex] = newScore;
                    //then we need to correct its position
                    let newItemIndex = aggregateItemIndex;
                    while (newItemIndex > 0 && aggregateTop5List.itemVotes[newItemIndex - 1] < newScore) {
                        let tempScore = aggregateTop5List.itemVotes[newItemIndex - 1];
                        let tempItem = aggregateTop5List.items[newItemIndex - 1];
                        aggregateTop5List.itemVotes[newItemIndex - 1] = newScore;
                        aggregateTop5List.items[newItemIndex - 1] = aggregateTop5List.items[newItemIndex];
                        aggregateTop5List.itemVotes[newItemIndex] = tempScore;
                        aggregateTop5List.items[newItemIndex] = tempItem;
                        newItemIndex--;
                    }
                }
                //now we can save the updated aggregate

            });
        }
        aggregateTop5List
        .save()
        .then(() => {
            console.log("Aggregate list created!!! " + aggregateTop5List);
            return aggregateTop5List;
        })
    }).catch(err => console.log(err));
}

handleDelete = async (top5List) => {
    await AggregateTop5List.findOne({ name: { $regex: new RegExp("^" + top5List.name + "$", "i") } }, (err, aggregateTop5List) => {
        if (aggregateTop5List) {
            top5List.items.forEach(function(item, index, array) {
                let aggregateItemIndex = aggregateTop5List.items.findIndex(aggItem => {
                    return aggItem.toLowerCase() === item.toLowerCase();
                });
                //update the current score
                let newScore = aggregateTop5List.itemVotes[aggregateItemIndex] - (5 - index);
                if (newScore === 0) {
                    //case where we simply need to delete an item
                    aggregateTop5List.items.splice(aggregateItemIndex, 1);
                    aggregateTop5List.itemVotes.splice(aggregateItemIndex, 1);
                } else {
                    aggregateTop5List.itemVotes[aggregateItemIndex] = newScore;
                    //then we need to correct its position
                    let newItemIndex = aggregateItemIndex;
                    while (newItemIndex < aggregateTop5List.itemVotes.length - 1 && aggregateTop5List.itemVotes[newItemIndex + 1] > newScore) {
                        let tempScore = aggregateTop5List.itemVotes[newItemIndex + 1];
                        let tempItem = aggregateTop5List.items[newItemIndex + 1];
                        aggregateTop5List.itemVotes[newItemIndex + 1] = newScore;
                        aggregateTop5List.items[newItemIndex + 1] = aggregateTop5List.items[newItemIndex];
                        aggregateTop5List.itemVotes[newItemIndex] = tempScore;
                        aggregateTop5List.items[newItemIndex] = tempItem;
                        newItemIndex++;
                    };
                }
            });

            //now we can save the updated aggregate
            if (aggregateTop5List.items.length === 0) {
                AggregateTop5List.findOneAndDelete({ _id: aggregateTop5List._id }, () => {
                    console.log("Aggregate list deleted!");
                }).catch(err => {
                    console.log(err)
                })
            } else {
                aggregateTop5List
                .save()
                .then(() => {
                    console.log("Aggregate list created!!! " + aggregateTop5List);
                    return aggregateTop5List;
                })
                }
        }
    }).catch(err => console.log(err));
}

module.exports = {
    getAggregateTop5Lists,
    viewAggregateList,
    update,
    handleDelete
}