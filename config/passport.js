const localStrategy = require('passport-local').Strategy;
const comFun         = require('../commonFunctions');
const User = require('../model/user');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	passport.use(
		'local-signup',
		new localStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				passReqToCallback: true,
			},
			function (req, email, password, done) {
				process.nextTick(function () {
					let email1 = String.prototype.toLowerCase.apply(email)
					let firstName = req.body.fName;
					let lastName = req.body.lName;
					if(comFun.StrVal(email1)&& comFun.StrVal(password)&& comFun.StrVal(firstName) && comFun.StrVal(lastName))
					{
						User.findOne({'local.email':email1},
						function (err, user) {
							if (err) return done(err);
							if (user) {
								return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
							} else {
								var newUser = new User();
								newUser.local.email = email1;
								newUser.local.isVerified = false;
								newUser.firstName = firstName;
								newUser.lastName = lastName;
								newUser.local.password = newUser.generateHash(password);
								newUser.save(function (err) {
									if (err) throw err;
									return done(null, newUser);
								});
							}
						}
					);
					}else {
						return done(null, false,req.flash('signupMessage', 'Error in the request'));
					}

				});
			}
		)
	);

	passport.use(
		'local-login',
		new localStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				passReqToCallback: true,
			},
			function (req, email, password, done) {
				User.findOne(
					{
						'local.email': String.prototype.toLowerCase.apply(email),
					},
					function (err, user) {
						if (err) return done(err);
						if (!user) return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
						if (!user.validPassword(password))
							return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
						return done(null, user);
					}
				);
			}
		)
	);
};
