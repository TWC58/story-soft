const auth = require('./user-controller')
const Section = require('../models/section-model')
const StoryPost = require('../models/story-post-model')
const ComicPost = require('../models/comic-post-model')

createSection = async (name = "Untitled", parent = null, children = []) => {
    const section = new Section({
        name: name,
        parent: parent,
        children: children,
        comments: []
    })
    await section.save();
    return section;
}

// Add a new section
addSection = (req, res) => {
    auth.isLoggedIn(req, res, async function () {

        const body = req.body;
        // console.log(req.params.id);

        let section = new Section({
            name: "Untitled",
            parent: req.params.id,
            children: [],
            comments: []
        })

        if (!section) {
            return res.status(400).json({ success: false, error: err })
        }

        // Create a new section
        section
            .save()
            .then(savedSection => {
                // Find the parent's section by its id and push the new section's id to the children of the parent
                Section.findById({ _id: req.params.id }, (err, parentSection) => {
                    if (err) {
                        return res.status(400).json({ success: false, error: err })
                    }

                    parentSection.children.push(savedSection._id);
                    parentSection
                        .save()
                        .then(() => {
                            return res.status(200).json({ success: true, section: savedSection })
                        })

                })
            })
    });
}

// Delete section after user confirms the "Delete Section" button
deleteSection = async (req, res) => {
    // StoryPost.findOne({ rootSection: req.params.id }, (err, storypost) => {
    //     console.log(storypost);
    //     return res.status(200).json({ success: true, post: storypost })
    // })
    Section.findById({ _id: req.params.id }, (err, section) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Section not found!',
            })
        }
        Section.findOneAndDelete({ _id: req.params.id }, (err, deletedSection) => {
            if (deletedSection) {
                Section.findById({ _id: deletedSection.parent }, (err, parentSection) => {
                    if (err) {
                        return res.status(400).json({ success: false, error: err })
                    }
                    let index = parentSection.children.indexOf(deletedSection._id);
                    if (index > -1) {
                        console.log(parentSection.children);
                        parentSection.children.splice(index, 1);
                        console.log(parentSection.children);
                        parentSection
                            .save()
                            .then(() => {
                                return res.status(200).json({ success: true, data: deletedSection, parentId: parentSection })
                            })
                    }
                })
            }
        })
    })
}

// Get section by id
getSection = async (req, res) => {
    Section.findOne({ _id: req.params.id }, (err, section) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        console.log(section);
        section._id = req.params.id;
        return res.status(200).json({ success: true, section: section })
    }).catch(err => console.log(err))
}

updateSection = async (req, res) => {
    auth.isLoggedIn(req, res, async function () {
        Section.findById({ _id: req.params.id }, (err, section) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            const body = req.body;
            section.name = body.name;
            section.data = body.data;
            console.log(section);
            section
                .save()
                .then(() => {
                    return res.status(200).json({ success: true, section: section })
                })
        })
    });
}

module.exports = {
    createSection,
    addSection,
    deleteSection,
    getSection,
    updateSection
}