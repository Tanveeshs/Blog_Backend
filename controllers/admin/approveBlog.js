const Blog = require('../../model/blog');
const comFun = require('../../commonFunctions');

module.exports.approveBlog = (req,res,next)=> {
    if (!comFun.strVal(req.body.id)|| !comFun.numVal(req.body.status)) {
        res.json({success: 0, message: "Error"})
        return next();
    } else {
        if(res.locals.admin){
            let id = req.body.id;
            let status = req.body.status;
            Blog.findOneAndUpdate({_id:id},{$set:{status:status}}, (err, t) => {
                if(err){
                    res.json({success:0,message:"ERROR"});
                    return next();
                }else {
                    res.json({success:1,message:"Success",});
                    return next();
                }
            })
        }else {
            res.json({success:-10,message:"Unatuthorized"});
            return next();
        }
    }
}