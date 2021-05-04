const Blog = require('../../model/blog')
const comFun = require('../../commonFunctions');

module.exports.searchBlog = (req,res,next)=> {
    if (!comFun.numVal(req.body.page)|| !comFun.strVal(req.body.search)) {
        res.json({success: 0, message: "Error"})
        return next();
    } else {
        let page = req.body.page;
        let search = req.body.search;
        let skip = page * 10;
        Blog.find({$text:{$search:search}},{score:{$meta:"textScore"}}, (err, t) => {
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
        }).sort({score:{$meta:"textScore"}}).skip(skip).limit(10)
    }
}