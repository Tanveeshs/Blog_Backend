const Blog = require('../../model/blog')
const comFun = require('../../commonFunctions');

module.exports.getMyBlog = (req,res,next)=> {
    if (!comFun.numVal(req.body.page)) {
        res.json({success: 0, message: "Error"})
        return next();
    } else {
        let page = req.body.page;
        let userId = res.locals.userId;
        let skip = page * 10;
        Blog.find({by:userId,status:{$nin:[0]}}, (err, t) => {
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
    }
}