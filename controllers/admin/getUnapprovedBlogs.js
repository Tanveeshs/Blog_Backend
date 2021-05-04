const Blog = require('../../model/blog');
const comFun = require('../../commonFunctions');

module.exports.getUnapprovedBlog = (req,res,next)=> {
    if (!comFun.numVal(req.body.page)) {
        res.json({success: 0, message: "Error"})
        return next();
    } else {
        if(res.locals.admin){
            let page = req.body.page;
            let skip = page * 10;
            Blog.find({status:0}, (err, t) => {
                if(err){
                    res.json({success:0,message:"ERROR"});
                    return next();
                }else {
                    if(t.length!==0){
                        res.json({success:1,message:"Success",blogs:t});
                    }else {
                        res.json({success:-1,message:"No blogs Found"});
                    }
                }
            }).sort({timeAt:-1}).skip(skip).limit(10)
        }else {
            res.json({success:-10,message:"Unatuthorized"});
            return next();
        }
    }
}