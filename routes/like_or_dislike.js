const comFun = require('../commonFunctions');
const Blog = require('../model/blog');
const User = require('../model/user');
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;

module.exports.like_or_dislike = (req,res,next)=>{
    if(!comFun.StrVal(req.body.blog) || !comFun.numVal(req.body.like)){
        res.json({success: 0,message:"Error!"});
        console.log("ISS MEIN")
        return next();
    }else {
        let userId = res.locals.userId;
        let blog = req.body.blog;
        let like = parseInt(req.body.like);
        User.findOneAndUpdate({_id:userId,liked:{$nin:[new ObjectID(blog)]}},{$push:{liked:new ObjectID(blog)}},(err,doc)=>{
            if(err){
                console.log(err)
                res.json({success:0,message:"Error!"});
                return next();
            }else if(!comFun.NotNullUndef(doc)){
                res.json({success:-10,message:"Already liked or disliked"});
                return next();
            }else {
                let updObj={$inc:{}};
                if(like===0){
                    updObj.$inc.dislike = 1
                }else {
                    updObj.$inc.like = 1;
                }
                Blog.findOneAndUpdate({_id:blog},updObj,function (err) {
                    if (err) {

                        console.log(err)
                        res.json({success: 0, message: "Error!"});
                        return next();
                    } else {
                        res.json({success: 1, message: "Success"})
                    }
                })
            }
        })
    }
}
