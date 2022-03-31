const StoryTag = require('../models/story-tag-model');

//This function takes a post and its new tags (old tags are stored in the post currently)
//then handles updating and/or creating each tag object as needed (removing the post)
//from tags that are now removed and adding to tags that are new)
processTags = (post, newTags) => {
    //first figure out which tags are new and add this post to the tag
    let tagsDifference = newTags.filter(tag => !post.tags.includes(tag));//this holds all tags in newTags that were not already present in post.tags
    //two cases: the tag already exists or does not exist
    tagsDifference.array.forEach(tag => {//for each truly new tag
        StoryTag.findOne({name: tag}, (err, tag) => {
            if (!tag) {
                //case where the tag isn't already existing
                const newTag = new StoryTag({
                    name: tag,
                    posts: [post._id]
                });//create the new tag with the post ID stored as it's only current post
                newTag.save();
            }
            //otherwise, the tag exists
            tag.posts.push(post._id);//add the post _id to the current list of ids in the tag
            tag.save();//save the updated tag
        })
    });

    //next, figure out which tags have been removed and remove this post from that tag
    let oldTags = post.tags.filer(tag => !newTags.includes(tag));

    oldTags.array.forEach(tag => {
        StoryTag.findOne({name: tag}, (err, tag) => {
            //two cases, the post is the last one in the tag or there are more posts still present
            if (tag.posts.length === 1) {
                //case where the tag just needs to be deleted
                StoryTag.deleteOne({_id: tag._id});
            }
            //otherwise we need to remove the post._id from the tag.posts array and then save the updated tag
            const index = tag.posts.indexOf(post._id);
            if (index > -1) {
                tag.posts.splice(index, 1);
            }
            tag.save();
        })
    });
}

//not exposed by router
getPostIdsByTag = async (tag) => {
    const tagFound = await StoryTag.findOne({name: tag});
    return (tagFound) ? tagFound.posts : [];
}

getTags = async (req, res) => {
    const tags = await StoryTag.find({});
    return res.status(200).json({ success: true, tags: tags });
}

module.exports = {
    processTags,
    getPostIdsByTag,
    getTags
}