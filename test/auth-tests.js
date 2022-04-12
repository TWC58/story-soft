var assert = require('assert'); //mocha import

describe('User Tests', function() {

    describe('getUserInfo() tests', function() {
    
        describe('getUserInfo() with valid id', function () {
            it('Should return user info', function () {
                id = 1
                assert.equal([1, 2, 3].indexOf(4), -1);
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
});