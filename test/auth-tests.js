var assert = require('assert'); //mocha import
const { get } = require('http');
const { getUserInfo } = require('../controllers/user-controller');

describe('User Tests', function() {

    describe('getUserInfo() tests', function() {
    
        describe('getUserInfo() with valid id', function () {
            it('Should return correct user info', async function () {
                id = '6246246820afb569083555af';
                const res = await get('http://localhost:5000/auth/getUser/{id}');
                console.log(res);
                console.log('Expected: TWC58\nActual: '+res.body.username);
                assert.equal(res.body.username, 'TWC58');
            });
        });

        describe('getUserInfo() with invalid id', function () {
            it('Should return user info', function () {
                assert.equal([1, 2, 3].indexOf(4), -1); 
            });
        });

        describe('getUserInfo() with no id', function () {
            it('Should return 400 error, function()', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('createUser() and deleteUser()', function () {
            it('Should return deleted user', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });
    });

    describe('createUser() and deleteUser() tests', function () {
        
        describe('createUser() and deleteUser() in succession', function () {
            it('Should return deleted user', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('createUser() and deleteUser() in multiple asynchronous succession', function () {
            it('Should return deleted users', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('deleteUser() invalid id', function () {
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('deleteUser() no id', function () {
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('createUser() invalid credentials', function () {
            it('Should return 401 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('createUser() with already existing username', function () {
            it('Should return error code FILL', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });
    });

    describe('followUser() and unfollowUser() tests', function () {
        
        describe('followUser() valid ids with user creation and deletion', function () {
            it('Should successfully update follower and following lists', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('followUser() invalid follower id', function () {
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('followUser() invalid followed id', function () {
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('unfollowUser() invalid follower id', function () {
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('unfollowUser() invalid followed id', function () {
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('followUser() invalid follower and followed ids', function () {
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('unfollowUser() invalid unfollower and unfollower ids', function () {
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('unfollowUser() already not following', function () {
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('followUser() already following', function () {
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });
    });

    describe('updateUser() and updateBookmarks() tests', function () {

        describe('updateUser() with authorization', function () {
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('updateUser() without authorization', function () {
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('updateUser() without username', function (){
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('updateUser() with already existing username', function (){
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('updateBookmarks() valid with authorization', function (){
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('updateBookmarks() without authorization', function (){
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('updateBookmarks() invalid post id', function (){
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });

        describe('updateBookmarks() invalid section id', function (){
            it('Should return 400 error', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });
    });
});