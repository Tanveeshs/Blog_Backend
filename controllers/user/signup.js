const comFun = require('../../commonFunctions');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../utils/mailer');

module.exports.signup = (req,res,next)=>{
    if(comFun.NotNullUndef(req.user)){
        let cipher = crypto.createCipher('aes256',"Secret");
        let encrypted = cipher.update(String(req.user._id), 'utf8', 'hex') + cipher.final('hex');
        const secret = process.env.verify_mail_secret;
        let date = Date.now();
        date += 24 * 60 * 60 * 1000;
        const payload = {
            id: req.user._id,
            email: req.user.local.email,
            endDate: date,
        };
        const token = jwt.sign(payload, secret);
        let url = 'http://localhost:3000/verify/' + token;
        let content = `<p>Hey User,</p>
                        <p><br></p>
                        <p>You are just one step away from Meditation For You.</p>
                        <p><br></p>
                        <p><span style="color: rgb(44, 130, 201);"><a href="${url}">Click here</a></span> to Verify your mail and unleash happiness.</p>
                        <p><br></p>
                        <p>If the above link doesn&#39;t work manually paste this link in your browser</p>
                        <p><span style="font-size: 12px;">${url}</span></p>
                        <p><br></p>
                        <p>-Team Meditation For You</p>`;
        mailer(req.user.local.email, 'Verify your E-Mail Address', content)
            .on('error',function (s){
                console.log(s);
                res.json({success:-10,message:"Mail not sent"})
                return next();
            })
            .on('done',function (s) {
                console.log(url);
                res.json({ success: 1, message: 'Signup Success', token: encrypted });
                return next()
            })
    }else {
        res.json({ success: 0, message: 'Sorry there is some error'});
    }
}