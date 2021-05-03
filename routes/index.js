const comFun = require('../commonFunctions')
const jwt    = require('jsonwebtoken');
const moment = require('moment');

module.exports = (app)=>{
    const verifyMail            = require('./verifyMail');
    const forgotPassword        = require('./forgotPassword');
    const addBlog               = require('./add_blog');
    const delBlog               = require('./del_blog');
    const updBlog               = require('./upd_blog');
    const addComment            = require('./add_comment');
    const delComment            = require('./del_comment');
    const getBlog               = require('./get_blog');
    const getBlogsByPage        = require('./getBlogsByPage');
    const likeOrDislike         = require('./like_or_dislike');
    const getMyBlogs            = require('./getMyBlogs');
    const getLikedBlogs         = require('./getLikedBlogs');
    const searchBlog            = require('./searchBlog');
    const getUnapprovedBlogs    = require('./getUnapprovedBlogs');
    const approveBlog           = require('./approve_blog');
    /* VERIFY MAIL */
    app.post('/verify',verifyMail.VerifyMail);
    app.get('/verify/:token',verifyMail.verifyMailToken);
    /* VERIFY MAIL */

    /*PASSWORD CHANGE ROUTES */
    app.post('/forgot_pass/genToken',forgotPassword.password_reset);
    app.post('/forgot_pass/verifyToken',forgotPassword.verifyToken);
    app.post('/forgot_pass/update_password',forgotPassword.updPassword)
    app.post('/change_password',comFun.jwtAuth,forgotPassword.change_password);
    /*PASSWORD CHANGE ROUTES */

    app.post('/addBlog',comFun.jwtAuth,addBlog.addBlog);
    app.post('/delBlog',comFun.jwtAuth,delBlog.delBlog);
    app.post('/updBlog',comFun.jwtAuth,updBlog.updBlog);
    app.post('/addComment',comFun.jwtAuth,addComment.addComment);
    app.post('/delComment',comFun.jwtAuth,delComment.delComments);
    app.post('/getBlog',comFun.jwtAuth,getBlog.getBlog);
    app.post('/getBlogsByPage',comFun.jwtAuth,getBlogsByPage.getBlog);
    app.post('/like',comFun.jwtAuth,likeOrDislike.like_or_dislike);
    app.post('/getMyBlogs',comFun.jwtAuth,getMyBlogs.getBlog);
    app.post('/getLikedBlogs',comFun.jwtAuth,getLikedBlogs.getBlog);
    app.post('/searchBlog',comFun.jwtAuth,searchBlog.getBlog)


    app.post('/getUnapprovedBlogs',comFun.jwtAuth,getUnapprovedBlogs.getBlog)
    app.post('/approveBlog',comFun.jwtAuth,approveBlog.getBlog);
    //Only for testing so that I dont have to generate a token to hit a route
    app.post('/generatePermanentToken',(req,res,next)=>{
        let a  = {
            secret:"Untangle11",
            expiry_date:moment().add(10,"years").format("YYYY-MM-DDTHH:mm:ss.SSS")
        }
        let token = jwt.sign(a,"Secret11")
        res.json({success:1,token:token})
        return next()
    })
}
