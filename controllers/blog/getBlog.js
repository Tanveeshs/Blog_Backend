const Blog = require('../../model/blog');
const comFun = require('../../commonFunctions');
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;

module.exports.getBlog = (req,res,next) => {
    if(!comFun.strVal(req.body.blog)){
        console.log("Error in  fields");
        res.json({success: 0, message: "Error"})
        return next();
    } else {
        let blog = req.body.blog;
        Blog.aggregate([
            {
                "$match": {
                    "_id": new ObjectID(blog),
                    "status":1
                }
            },
            {
                "$lookup": {
                    "from": "comments",
                    "localField": "_id",
                    "foreignField": "blog",
                    "as": "comments"
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "by",
                    "foreignField": "_id",
                    "as": "user"
                }
            }

        ],function (err,data){
            if(err){
                res.json({success:0,message:"Error"});
                return next();
            }else {
                console.log(data)
                res.json({success:1,message:"Success",data:data});
                return next();
            }
        })
    }
}