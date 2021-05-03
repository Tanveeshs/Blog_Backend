const mongoose = require('mongoose');
const comFun = require('../commonFunctions');
const commentSchema = new mongoose.Schema({
    blog:mongoose.Schema.Types.ObjectId,
    user:mongoose.Schema.Types.ObjectId,
    comment:String,
    timeAt:{type:Date,default:comFun.getCurrTime}
});

const Blog = mongoose.model('comments', commentSchema,'comments');

module.exports = Blog;
