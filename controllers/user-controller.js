const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
const Like = require('../models/like-model')

getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId });
        return res.status(200).json({
            loggedIn: true,
            user: {
                _id: loggedInUser._id,
                username: loggedInUser.username,
                email: loggedInUser.email,
                bio: loggedInUser.bio,
                likes: loggedInUser.likes,
                dislikes: loggedInUser.dislikes,
                followers: loggedInUser.followers,
                following: loggedInUser.following,
                bookmarks: loggedInUser.bookmarks
            }
        });
    })
}

registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        const existingUserByEmail = await User.findOne({ email: email });
        const existingUserByUsername = await User.findOne({ username: new RegExp("^" + username + "$", "i") });
        if (existingUserByEmail) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }
        if (existingUserByUsername) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this username already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username, email, hashedPassword
        });
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser);

        await res.cookie("token", token, {
            // httpOnly: true,
            // secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                username: loggedInUser.username,
                email: loggedInUser.email,
                bio: "",
                likes: [],
                dislikes: [],
                followers: [],
                following: [],
                bookmarks: []
            }
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }

        const existingUser = await User.findOne({ email: email });
        
        if (!existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "The credentials entered do not match an existing account."
                })
        }

        bcrypt.compare(password, existingUser.passwordHash, function(err, match) {
            if (err){
                return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: err
                }).send();
            }
            if (match) {
                // Send JWT
                const token = auth.signToken(existingUser);
                return res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                }).status(200).json({
                    success: true,
                    user: {
                        username: existingUser.username,
                        firstName: existingUser.firstName,
                        lastName: existingUser.lastName,
                        email: existingUser.email,
                        likes: likes
                    }
                }).send();
            } else {
                return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: err
                }).send();
            }
          });
    } catch (err) {
        console.error(err);
        return res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    try {
        return res.clearCookie("token")
        .status(200).json({
            success: true
        });
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

module.exports = {
    getLoggedIn,
    loginUser,
    logoutUser,
    registerUser
}