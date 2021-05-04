const UserModel = require('../../model/user');
const comFun = require('../../commonFunctions');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports.login = (req,res,next)=>{
    let userId = req.user.id;
    let obj = {
        userId:userId,
        admin: req.user.admin,
        expiry_date:moment().add(1,"week").format("YYYY-MM-DDTHH:mm:ss.SSS")
    }
    let token = jwt.sign(obj,"Secret");
    UserModel.findOne({_id:userId},{'local.email':1,firstName:1,lastName:1,'local.isVerified':1},function(err,data){
        if(err){
            console.log('Error',err);
            res.json({success:0,message:"Error"})
            return next();
        }else if(!comFun.notNullUndef(data)){
            console.log('Error',err);
            res.json({success:0,message:"Error"})
            return next();
        }else {
            if(data.local.isVerified){
                res.json({success:1,message:"Success",user:data,token:token});
                return next();
            }else {
                res.json({success:-10,message:"Not verified"});
                return next();

            }
        }
    })
}