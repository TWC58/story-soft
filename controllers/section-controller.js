const Section = require('../models/section-model')

createSection = async (name = "Untitled", parent = null, children = []) => {
    const section = new Section({
        name: name,
        parent: parent,
        children: children,
        comments: []
    })
    await section.save();
    return section;//TODO is _id stored in here?
}

// Delete section after user confirms the "Delete Section" button
deleteSection = async (req, res) => {
    Section.findById({ _id: req.params.id }, (err, section) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Section not found!',
            })
        }
        Section.findOneAndDelete({ _id: req.params.id }, () => {
            return res.status(200).json({ success: true, data: section })
        }).catch(err => console.log(err))
    })
}

// 
getSection = async (req, res) => {
    await Section.findById({ _id: req.params.id }, (err, section) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        return res.status(200).json({ success: true, section: section })
    }).catch(err => console.log(err))
}

module.exports = {
    createSection,
    deleteSection,
    getSection
}