const Tag = require('../models/tag-model');

//This function takes a post and its new tags (old tags are stored in the post currently)
//then handles updating and/or creating each tag object as needed (removing the post)
//from tags that are now removed and adding to tags that are new)
processTags = (post, newTags) => {
    //first figure out which tags are new and add this post to the tag
    //two cases: the tag already exists or does not exist

    //next, figure out which tags have been removed and remove this post from that tag
}

module.exports = {
    
}