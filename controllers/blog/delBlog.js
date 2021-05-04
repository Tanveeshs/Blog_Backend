const comFun = require('../../commonFunctions')
const Blog = require('../../model/blog');

module.exports.delBlog = (req,res,next)=>{
    if (!comFun.strVal(req.body.id)) {
        console.log("Error in  fields");
        res.json({success: 0, message: "Error"})
        return next();
    } else {
        const id = req.body.id;
        const userId = res.locals.userId;
        Blog.findOneAndDelete({_id:id,by:userId},(err)=>{
            if(err){
                res.json({success:0,message:"Error"})
                return next();
            }else {
                res.json({success:1,message:"Updated"});
                return next();
            }
        })
    }
}