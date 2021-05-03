const mongoose = require('mongoose');
const comFun = require('../commonFunctions');
const forgotPassSchema = new mongoose.Schema({
    email:String,
    otp:String,
    userId:mongoose.Schema.Types.ObjectId,
    expiry:String,
    timeAt:{
        type:String,
        default:comFun.getCurrTime
    }
});
forgotPassSchema.index({email:1,otp:1,expiry:1})
const ForgotPass = mongoose.model('forgot_pass', forgotPassSchema,'forgot_pass');

module.exports = ForgotPass;
