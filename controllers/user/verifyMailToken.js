const jwt = require('jsonwebtoken');
const User = require('../../model/user');

module.exports.verifyMailToken = function (req, res, next) {
    let secret = process.env.verify_mail_secret;
    let token = req.params.token;
    let payload = jwt.verify(token, secret);
    if (payload.endDate < Date.now()) {
        res.json({ success: 0, message: 'Link Expired' });
        return next();
    } else {
        User.findOneAndUpdate({_id:payload.id},{$set:{'local.isVerified':true}},
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.json({ success: 0, message: 'Sorry there is some error' });
                    return next();
                }
                if (result == null) {
                    res.json({ success: 0, message: 'Incorrect Link' });
                    return next();
                } else {
                    //RENDER EJS HERE
                    res.json({ success: 1, message: 'Email verified' });
                    return next();
                }
            });
    }
};