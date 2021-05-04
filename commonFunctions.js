const moment = require('moment')
const jwt = require('jsonwebtoken')

let self = module.exports = {
    strVal: function (v) {
        let type = typeof v;
        if(type === 'undefined') {
            return false;
        }
        if(v === null) {
            return false;
        }
        if(v === undefined) {
            return false;
        }
        if(type === 'string') {
            return v.length >= 1;
        }
        return false;
    },
    notNullUndef: function (v) {
        let type = typeof v;
        if(type === 'undefined') {
            return false;
        }
        if(v === null) {
            return false;
        }
        if(v === undefined) {
            return false;
        }
        return true;
    },
    getCurrTime: function(){
        return moment().utcOffset(330).format("YYYY-MM-DDTHH:mm:ss.SSS");
    },
    numVal: function (v) {
        let type = typeof v;
        if(type === 'undefined') {
            return false;
        }
        if(v === null) {
            return false;
        }
        if(v === undefined) {
            return false;
        }
        if(type === /*'number'*/ 'string' || type === 'number') {
            if(!isNaN(v)) {
                return true;
            }
        }
        return false;
    },
    jwtAuth:function (req,res,next){
        if(self.notNullUndef(req.headers['x-auth-token'])){
            let token = req.headers['x-auth-token'];
            console.log(token);
            jwt.verify(token,"Secret",function (err,a){
                if(err){
                    res.json({success: 0, message: "Incorrect Params"})
                    return;
                }
                console.log(a);
                console.log(Date.now());
                if(a.expiry_date>self.getCurrTime()){
                    res.locals.userId = a.userId;
                    res.locals.admin = a.admin;
                    return next();
                } else {
                    res.json({success: 0, message: "Incorrect Hit"})
                    return;
                }
            })

        }else {
            res.json({success:0,message:"Incorrect Hit"})
            return ;
        }
    }
}

