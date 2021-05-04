const comFun = require('../commonFunctions')
const jwt    = require('jsonwebtoken');
const moment = require('moment');

module.exports = (app,passport)=>{
    const verifyMail            = require('../controllers/user/verifyMail');
    const addBlog               = require('../controllers/blog/addBlog');
    const delBlog               = require('../controllers/blog/delBlog');
    const updBlog               = require('../controllers/blog/updBlog');
    const addComment            = require('../controllers/comments/addComments');
    const delComment            = require('../controllers/comments/delComment');
    const getBlog               = require('../controllers/blog/getBlog');
    const getBlogsByPage        = require('../controllers/blog/getBlogsByPage');
    const likeOrDislike         = require('../controllers/blog/likeBlog');
    const getMyBlogs            = require('../controllers/blog/getMyBlogs');
    const getLikedBlogs         = require('../controllers/blog/getLikedBlogs');
    const searchBlog            = require('../controllers/blog/searchBlog');
    const getUnapprovedBlogs    = require('../controllers/admin/getUnapprovedBlogs');
    const approveBlog           = require('../controllers/admin/approveBlog');
    const login                 = require('../controllers/user/login');
    const loginSignupFail       = require('../controllers/user/loginSignupFail');
    const signup                = require('../controllers/user/signup');
    const verifyMailToken       = require('../controllers/user/verifyMailToken');
    const genToken              = require('../controllers/forgotPassword/genToken')
    const verifyPasswordToken   = require('../controllers/forgotPassword/verifyToken')
    const updatePassword        = require('../controllers/forgotPassword/updPassword')
    const changePassword        = require('../controllers/user/changePassword')
    /*USER ROUTES */

    app.post('/login', passport.authenticate('local-login', {
            failureRedirect: '/loginFail',
            failureFlash: true,
        }),login.login);
    app.post('/signup',passport.authenticate('local-signup', {
        failureRedirect: '/signupFail',
        failureFlash: true,
    }),signup.signup);
    app.get('/loginFail',loginSignupFail.loginSignupFail);
    app.get('/loginFail',loginSignupFail.loginSignupFail);

    /*USER ROUTES */


    /* VERIFY MAIL */
    app.post('/verify',verifyMail.verifyMail);
    app.get('/verify/:token',verifyMailToken.verifyMailToken);
    /* VERIFY MAIL */

    /*PASSWORD CHANGE ROUTES */
    app.post('/forgotPass/genToken',genToken.genToken);
    app.post('/forgotPass/verifyToken',verifyPasswordToken.verifyToken);
    app.post('/forgotPass/updatePassword',updatePassword.updPassword)
    app.post('/changePassword',comFun.jwtAuth,changePassword.changePassword);
    /*PASSWORD CHANGE ROUTES */

    /*Main App Routes */
    app.post('/addBlog',comFun.jwtAuth,addBlog.addBlog);
    app.post('/delBlog',comFun.jwtAuth,delBlog.delBlog);
    app.post('/updBlog',comFun.jwtAuth,updBlog.updBlog);
    app.post('/addComment',comFun.jwtAuth,addComment.addComment);
    app.post('/delComment',comFun.jwtAuth,delComment.delComments);
    app.post('/getBlog',comFun.jwtAuth,getBlog.getBlog);
    app.post('/getBlogsByPage',comFun.jwtAuth,getBlogsByPage.getBlog);
    app.post('/like',comFun.jwtAuth,likeOrDislike.likeBlog);
    app.post('/getMyBlogs',comFun.jwtAuth,getMyBlogs.getMyBlog);
    app.post('/getLikedBlogs',comFun.jwtAuth,getLikedBlogs.getLikedBlog);
    app.post('/searchBlog',comFun.jwtAuth,searchBlog.searchBlog)
    /*Main App Routes */


    /* Admin Routes */
    app.post('/getUnapprovedBlogs',comFun.jwtAuth,getUnapprovedBlogs.getUnapprovedBlog)
    app.post('/approveBlog',comFun.jwtAuth,approveBlog.approveBlog);
    /* Admin Routes */
}
