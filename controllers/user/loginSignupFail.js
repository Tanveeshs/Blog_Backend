

module.exports.loginSignupFail = (req,res,next)=>{
    res.json({ success: 0, message: 'Login/Signup Fail' });
    return next();
}