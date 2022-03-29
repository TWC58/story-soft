const UserController = require('../controllers/user-controller')
const express = require("express");
const router = express.Router();

router.post('/login', UserController.loginUser)
router.post('/register', UserController.registerUser)
router.get('/logout', UserController.logoutUser)
router.get('/loggedIn', UserController.getLoggedIn)
router.get('/get/:id', UserController.get)
router.put('/update', UserController.update)

module.exports = router;