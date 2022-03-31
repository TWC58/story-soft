const StoryTag = require('../models/story-tag-model');
const ComicTag = require('../models/comic-tag-model');

const PostType = {
    STORY: "story",
    COMIC: "comic"
}

function processTagType(tagType) {
    if (tagType === PostType.STORY) {
        return StoryTag;
    } else if (tagType === PostType.COMIC) {
        return ComicTag;
    } 

    return null;
}

//This function takes a post and its new tags (old tags are stored in the post currently)
//then handles updating and/or creating each tag object as needed (removing the post)
//from tags that are now removed and adding to tags that are new)
processTags = (post, newTags, postType) => {

    let schemaType = (postType === PostType.STORY) ? StoryTag : ComicTag;

    //first figure out which tags are new and add this post to the tag
    let tagsDifference = newTags.filter(tag => !post.tags.includes(tag));//this holds all tags in newTags that were not already present in post.tags
    console.log("TAGS DIFFERENCE: " + tagsDifference);
    //two cases: the tag already exists or does not exist
    tagsDifference.forEach(tag => {//for each truly new tag
        schemaType.findOne({name: tag}, (err, tag) => {
            if (!tag) {
                //case where the tag isn't already existing
                const newTag = new schemaType({
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
    let oldTags = post.tags.filter(tag => !newTags.includes(tag));
    console.log("OLD TAGS: " + oldTags);

    oldTags.forEach(tag => {
        schemaType.findOne({name: tag}, (err, tag) => {
            //two cases, the post is the last one in the tag or there are more posts still present
            if (tag.posts.length === 1) {
                //case where the tag just needs to be deleted
                schemaType.deleteOne({_id: tag._id});
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
getPostIdsByTag = async (tag, postType) => {
    let schemaType = (postType === PostType.STORY) ? StoryTag : ComicTag;
    const tagFound = await schemaType.findOne({name: tag});
    return (tagFound) ? tagFound.posts : [];
}

getTags = async (req, res) => {
    let schemaType = processPostType(req.body.postType); 

    if (!schemaType) {
        return res.status(404).json({ success: false, error: err })//case where we have an invalid post type url parameter
    }

    const tags = await schemaType.find({});
    return res.status(200).json({ success: true, tags: tags });
}

module.exports = {
    processTags,
    getPostIdsByTag,
    getTags
}