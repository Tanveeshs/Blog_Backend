const comFun = require('../../commonFunctions')
const blog = require('../../model/blog');

module.exports.updBlog = (req,res,next)=>{
    if (!comFun.strVal(req.body.id)) {
        console.log("Error in  fields");
        res.json({success: 0, message: "Error"})
        return next();
    } else {
        const id = req.body.id;
        const userId = res.locals.userId;
        let updObj={};
        updObj.$set = {};
        updObj.$set.status =2;
        let isUpd = false;
        if(comFun.strVal(req.body.content)){
            updObj.$set.content = req.body.content;
            isUpd = true;
        }
        if(comFun.strVal(req.body.title)){
            updObj.$set.title = req.body.title;
            isUpd = true;
        }
        if(comFun.strVal(req.body.image)){
            updObj.$set.image = req.body.image;
            isUpd = true;
        }
        if(comFun.strVal(req.body.thumbnail)){
            updObj.$set.thumbnail = req.body.thumbnail;
            isUpd = true;
        }

        if(isUpd){
            blog.findOneAndUpdate({_id:id,by:userId},updObj,(err)=>{
                if(err){
                    res.json({success:0,message:"Error"})
                    return next();
                }else {
                    res.json({success:1,message:"Updated"});
                    return next();
                }
            })
        }else {
            res.json({success:-10,message:"No fields passed"})
            return next()
        }
    }
}