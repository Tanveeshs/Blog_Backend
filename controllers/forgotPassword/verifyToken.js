const crypto = require('crypto');
const ForgotPass = require('../../model/forgotPass');
const comFun = require('../../commonFunctions')

module.exports.verifyToken = (req, res, next)=> {
    if(!comFun.StrVal(req.body.otp)){
        res.json({success:0,message:"Sorry there is some error!"})
        return next()
    }else if(!comFun.StrVal(req.body.email)){
        res.json({success:0,message:"Sorry there is some error!"})
        return next()
    }
    else {
        let otp = req.body.otp;
        let email = req.body.email.toLowerCase();
        let time = comFun.getCurrTime();
        ForgotPass.findOne({email:email,otp:otp,expiry:{$gte:time}},function(err,doc){
            if(err){
                res.json({success:0,message:"Sorry there is some error!"})
                return next()
            }else if(comFun.NotNullUndef(doc)) {
                try {
                    let cipher = crypto.createCipher('aes256',"Secret");
                    let encrypted = cipher.update(String(doc.userId), 'utf8', 'hex') + cipher.final('hex');
                    res.json({success:1,message:"OTP Verified!",token:encrypted});
                    return next();
                } catch (e) {
                    console.error("Wrong Token Error")
                    res.json({success:0,message:"Error"})
                    return next()
                }
            }else {
                console.log(doc);
                res.json({success:-10,message:"Wrong or Expired OTP"})
                return next();
            }
        })
    }
}