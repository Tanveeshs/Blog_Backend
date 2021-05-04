const comFun = require('../../commonFunctions')
const blog = require('../../model/blog');

module.exports.addBlog = (req,res,next)=>{
    if (!comFun.strVal(req.body.thumbnail)|| !comFun.strVal(req.body.image) || !comFun.strVal(req.body.title)
        || !comFun.strVal(req.body.content)) {
        console.log("Error in  fields");
        res.json({success: 0, message: "Error"})
        return next();
    } else {
        const thumbnail = req.body.thumbnail;
        const image = req.body.image;
        const content = req.body.content;
        const title = req.body.title;
        const userId = res.locals.userId;

        const blogObj = new blog({
            title: title,
            content:content,
            image:image,
            thumbnail:thumbnail,
            by: userId
        })
        blogObj.save(function (err) {
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