const mongoose = require('mongoose');

exports.isValidObjectId = (value) => {
    // check first if undefined
    if (!value) {
        return false;
    }
    try {
        const {ObjectId} = mongoose.Types;
        const asString = value.toString(); // value is either ObjectId or string or anything
        const asObjectId = new ObjectId(asString);
        const asStringifiedObjectId = asObjectId.toString();
        return asString === asStringifiedObjectId;
    } catch (error) {
        return false;
    }
};

exports.generateErrorJSON = (message, details) => {
    return {error: message, details: details};
}