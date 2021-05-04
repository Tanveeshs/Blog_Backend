const jwt = require('jsonwebtoken');
const comFun = require('../../commonFunctions');
const User = require('../../model/user');
const mailer = require('../../utils/mailer');

module.exports.verifyMail = function (req, res, next) {
	const secret = process.env.verify_mail_secret;
	if (comFun.strVal(req.body.email)) {
		User.findOne(
			{
				'local.email': String.prototype.toLowerCase.apply(req.body.email),
			},
			function (err, result) {
				if (err) {
					console.log(err);
					res.json({ success: 0, message: 'Sorry there is some error' });
					return next();
				}
				if (result == null) {
					res.json({ success: 0, message: 'Email Not Found' });
					return next();
				} else {
					const emailAddress = String.prototype.toLowerCase.apply(req.body.email);
					let date = Date.now();
					date += 24 * 60 * 60 * 1000;
					const payload = {
						id: result._id,
						email: emailAddress,
						endDate: date,
					};
					let token = jwt.sign(payload, secret);
					let url = 'http://localhost:3000/verify/' + token;
					let content = `<p>Hey User,</p>
                        <p><br></p>
                        <p>You are just one step away from the Untangle.</p>
                        <p><br></p>
                        <p><span style="color: rgb(44, 130, 201);"><a href="${url}">Click here</a></span> to Verify your mail and unleash happiness.</p>
                        <p><br></p>
                        <p>If the above link doesn&#39;t work manually paste this link in your browser</p>
                        <p><span style="font-size: 12px;">${url}</span></p>
                        <p><br></p>
                        <p>-Team Untangle</p>`;
					console.log(content);
					mailer(emailAddress, 'Verify your E-Mail Address', content);
					res.json({ success: 1, message: 'Email Sent Successfully' });
					return next();
				}
			}
		);
	} else {
		res.json({ success: 0, message: 'Email Not Found' });
		return next();
	}
};
