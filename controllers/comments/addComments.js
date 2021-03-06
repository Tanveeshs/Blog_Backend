const comFun = require('../../commonFunctions')
const Comment = require('../../model/comments');

module.exports.addComment = (req,res,next)=>{
    if (!comFun.strVal(req.body.comment)|| !comFun.strVal(req.body.blog)) {
        console.log("Error in  fields");
        res.json({success: 0, message: "Error"})
        return next();
    } else {
        const comment = req.body.comment;
        const userId = res.locals.userId;
        const blog = req.body.blog;

        const commentObj = new Comment({
            comment:comment,
            user:userId,
            blog:blog
        })
        commentObj.save(function (err) {
            if (err) {
                console.error(err)
                res.json({success: 0, message: "ERROR"})
                return next();
            } else {
                res.json({success: 1, message: "Success"})
                return next();
            }
        })
    }
}