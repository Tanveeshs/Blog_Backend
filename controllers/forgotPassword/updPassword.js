const moment = require('moment');
const crypto = require('crypto');
const User = require('../../model/user');
const ForgotPass = require('../../model/forgotPass');
const mail = require('../../utils/mailer');
const sanitize = require("mongo-sanitize");
const comFun = require('../../commonFunctions')
const bcrypt = require('bcrypt-node');

module.exports.updPassword = (req, res,next)=> {
    if(!comFun.strVal(req.body.token)){
        console.error("No token")
        res.json({success:0,message:"Error"})
        return next()
    }
    else if(!comFun.strVal(req.body.password)){
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
                            '    <p>xyz@xyz.tech</p>\n' +
                            '    <p><br></p>\n' +
                            '    <p>-Thank you</p>\n' +
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
function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}