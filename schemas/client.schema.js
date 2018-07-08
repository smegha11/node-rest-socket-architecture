/**
 * Created by lcom59 on 3/27/2018.
 */

const mongoose = require('mongoose');
const clientSchema = mongoose.Schema({
    name: {type: String, required: [true, 'Name is required']},
    isVerified: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    contactInformation: {
        email: {
            type: String,
            validate: {
                validator: function (v) {
                    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(v);
                },
                message: '{VALUE} is not a valid email address!'
            },
            required: [true, 'Email is required'],
            unique: true
        },
        address: String,
        primaryMobilePhone: {
            type: String,
            validate: {
                validator: function (v) {
                    return /(\+91)\d{10}/.test(v);
                },
                message: '{VALUE} is not a valid phone number!'
            },
            required: [true, 'Primary mobile number required']
        },
        secondaryMobilePhone: {
            type: String,
            validate: {
                validator: function (v) {
                    return /(\+91)\d{10}/.test(v);
                },
                message: '{VALUE} is not a valid phone number!'
            }
        },
        landlinePhone: String,
        contactPerson: String
    },
    businessRelatedInfo: mongoose.Schema.Types.Mixed

});

clientSchema.methods.toJSON = function() {
    let obj = this.toObject();
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    delete obj.isDeleted;
    return obj
}

// create the model for users and expose it to our app
module.exports = mongoose.model('Client', clientSchema);

