// load the things we need
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
const userSchema = mongoose.Schema({

    email: String,
    password: String,
    name: String,
    isVerified: Boolean,
    isDeleted: Boolean,
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

