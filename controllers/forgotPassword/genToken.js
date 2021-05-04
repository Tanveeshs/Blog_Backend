const moment = require('moment');
const User = require('../../model/user');
const ForgotPass = require('../../model/forgotPass');
const mail = require('../../utils/mailer');
const sanitize = require("mongo-sanitize");
const comFun = require('../../commonFunctions')

module.exports.genToken = (req,res,next)=>{
    if (!comFun.strVal(req.body.email)) {
        res.json({success:0,message:"Email address not found"});
        return next();
    } else {
        User.findOne({
            'local.email': sanitize(req.body.email.toLowerCase()),
            'local.isVerified':true,
        },{_id:1},function(err, result) {
            if (err) {
                res.json({success:0,message:"Sorry there is some error"})
                return next();
            }
            if (result == null) {
                res.json({success:0,message:"User not found"})
                return next();
            } else {
                let emailAddress = req.body.email.toLowerCase();
                let otp = Math.floor(100000 + Math.random() * 900000)
                let content = `<!DOCTYPE html>
                          <html>
                          <body class="fr-no-selection">
                              <b>Your OTP for login is:${otp}</b>
                          </body>
                          </html>`
                ForgotPass.findOneAndUpdate({email:emailAddress},{
                    $set:{
                        otp:otp,
                        timeAt:comFun.getCurrTime(),
                        userId:result._id,
                        expiry:moment(comFun.getCurrTime()).add(5,'minutes').format('YYYY-MM-DDTHH:mm:ss.SSS')
                    }
                },{upsert:true},function (err){
                    if(err){
                        res.json({success:0,message:"Sorry there is some error"})
                        return next();
                    }else {

                        mail(emailAddress,'Password Reset',content)
                            .on('error',function (s){
                                console.log(s);
                                res.json({success:0,message:"Mail not sent"})
                                return next();
                            })
                            .on('done',function (s) {
                                res.json({success:1,message:"Password Reset Mail Sent Successfully"});
                                return next()
                            });
                    }
                })
            }
        });
    }
}