//jshint esversion:6

const moment = require('moment');
const crypto = require('crypto');
const User = require('../model/user');
const ForgotPass = require('../model/forgot_pass');
const mail = require('../utils/mailer');
const sanitize = require("mongo-sanitize");
const comFun = require('../commonFunctions')
const bcrypt = require('bcrypt-node');


module.exports.password_reset = (req,res,next)=>{
    if (!comFun.StrVal(req.body.email)) {
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

module.exports.updPassword = (req, res,next)=> {
    if(!comFun.StrVal(req.body.token)){
        console.error("No token")
        res.json({success:0,message:"Error"})
        return next()
    }
    else if(!comFun.StrVal(req.body.password)){
        console.error("No password")
        res.json({success:0,message:"Error"})
        return next()
    }else{
        let token = req.body.token;
        try {
            let decipher = crypto.createDecipher('aes256',"Secret");
            let decrypted = decipher.update(token, 'hex', 'utf8') + decipher.final('utf8');
            User.findOneAndUpdate({_id:decrypted},
                {$set:{'local.password':generateHash(req.body.password)}},
                function(err, result) {
                    if (err) {
                        res.json({success:0,message:"Sorry there is some error"})
                        return next();
                    }
                    if (result == null) {
                        res.json({success:0,message:"User not found"})
                        return next();
                    } else {
                        let content = '<!DOCTYPE html>\n' +
                            '<html>\n' +
                            '\n' +
                            '<body class="fr-no-selection">\n' +
                            '    <p>Dear User,</p>\n' +
                            '    <p>Your password has been successfully reset.</p>\n' +
                            '    <p><br></p>\n' +
                            '    <p>If this change wasn&#39;t made by you contact support or mail us at</p>\n' +
                            '    <p>admin@bechdaal.tech</p>\n' +
                            '    <p><br></p>\n' +
                            '    <p>-Team Bech Daal</p>\n' +
                            '</body>\n' +
                            '\n' +
                            '</html>'
                        //Here we are not checking for email error as it might increase user wait time
                        mail(result.local.email,'Password Changed',content)
                        res.send({success:1,message:"Password changed successfully"});
                        return next();
                    }
                });
        }catch (e) {
            console.error("Wrong Token Error")
            res.json({success:0,message:"Error"})
            return next()
        }
    }
}

module.exports.change_password = function(req,res,next){
    if(!comFun.StrVal(req.body.oldPass)){
        console.error("No oldPass")
        res.json({success:0,message:"Error"})
        return next()
    }else if(!comFun.StrVal(req.body.newPass)){
        console.error("No newPass")
        res.json({success:0,message:"Error"})
        return next()
    }else {
        let oldPass = req.body.oldPass;
        let newPass = req.body.newPass;
        let user = res.locals.userId;
        User.findOne({_id:user},function(err,userObj){
            if(err){
                console.error("Error:",err);
                res.json({success:0,message:"Error"})
                return next();
            }else {
                if(bcrypt.compareSync(oldPass,userObj.local.password)){
                    User.findOneAndUpdate({_id:user},{$set:{'local.password':generateHash(newPass)}},
                        function (err){
                            if(err){
                                console.error("Error:",err);
                                res.json({success:0,message:"Error"})
                                return next();
                            }else {
                                res.json({success:1,message:"Password Changed!"})
                            }
                        })
                }else {
                    res.json({success:-10,message:"Password does not match"})
                }
            }
        })
    }
}
function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}
