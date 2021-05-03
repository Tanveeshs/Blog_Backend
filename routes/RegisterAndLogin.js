const UserModel = require('../model/user');
const comFun = require('../commonFunctions');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../utils/mailer');
const moment = require('moment');
const async = require('async');
module.exports = function (app, passport) {
	app.post('/login', passport.authenticate('local-login', {
		failureRedirect: '/loginFail', // redirect back to the signup page if there is an error
		failureFlash: true, // allow flash messages
	}), (req, res, next) => {
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
			}else if(!comFun.NotNullUndef(data)){
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
	});
	app.get('/loginFail', (req, res) => {
		res.json({ success: 0, message: 'Login Fail' });
	});
	app.get('/signupFail', (req, res) => {
		if (req.flash.signupMessage !== undefined) {
			res.json({ success: 0, message: req.flash().signupMessage[0] });
		} else {
			res.json({ success: 0, message: 'Signup Failed' });
		}
	});

	app.post('/signup',passport.authenticate('local-signup', {
		failureRedirect: '/signupFail', // redirect back to the signup page if there is an error
		failureFlash: true, // allow flash messages
	}),(req,res,next)=>{
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
	});
};
