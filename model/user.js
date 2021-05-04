const mongoose = require('mongoose');
const bcrypt = require('bcrypt-node');

const userSchema = new mongoose.Schema({
    local: {
        email: String,
        password: String,
        isVerified: Boolean,
    },
    firstName:String,
    lastName:String,
    admin: {type:Boolean,default:false},
    liked:[mongoose.Schema.Types.ObjectId]
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

const User = mongoose.model('users', userSchema,'users');

module.exports = User;
