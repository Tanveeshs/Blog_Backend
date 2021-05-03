const mongoose = require('mongoose');
const comFun = require('../commonFunctions');
const blogSchema = new mongoose.Schema({
    title:String,
    thumbnail:String,
    image:String,
    content:String,
    by:mongoose.Schema.Types.ObjectId,
    like:{type:Number,default:0},
    dislike:{type:Number,default:0},
    status:{type:Number,default:2},
    timeAt:{type:Date,default:comFun.getCurrTime},
    });
blogSchema.index({title:"text",content:"text"})

const Blog = mongoose.model('blogs', blogSchema,'blogs');

module.exports = Blog;
