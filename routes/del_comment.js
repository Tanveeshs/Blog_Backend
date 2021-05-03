const comFun = require('../commonFunctions')
const Comments = require('../model/comments');

module.exports.delComments = (req,res,next)=>{
    if (!comFun.StrVal(req.body.id)) {
        console.log("Error in  fields");
        res.json({success: 0, message: "Error"})
        return next();
    } else {
        const id = req.body.id;
        const userId = res.locals.userId;
        Comments.findOneAndDelete({_id:id,by:userId},(err)=>{
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