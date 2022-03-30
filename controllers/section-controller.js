const Section = require('../models/section-model')

createSection = (name = "Untitled", parent = null, children = []) => {
    const section = new Section({
        name: name,
        parent: parent,
        children: children,
        comments: []
    })
    section.save();
    return section;//TODO is _id stored in here?
}

module.exports = {
    createSection
}