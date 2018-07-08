/**
 * Created by lcom59 on 3/28/2018.
 */
const Client = require('../schemas/client.schema');
const {generateErrorJSON} = require('../shared/common');
exports.post = (body, done) => {
    let client = new Client(body);
    let err = client.validateSync();
    if (err) {
        done({error: err._message, details: err});
    }
    else {
        client.save().then((doc) => {
            done(null, doc);
        }).catch((err) => {
            done(generateErrorJSON(err.message, err));
        });
    }
}

exports.get = (id, done) => {
    Client.findOne({_id: id, isDeleted: false}).then((doc) => {
        done(null, doc);
    }).catch((err) => {
        done(generateErrorJSON(err.message, err));
    });
}

exports.getAll = (done) => {
    Client.find({isDeleted: false}).then((doc) => {
        done(null, doc);
    }).catch((err) => {
        done(generateErrorJSON(err.message, err));
    });
}

exports.put = (id, body, done) => {
    let client = new Client(body);
    let err = client.validateSync();
    if (err) {
        done({error: err._message, details: err});
    }
    else {
        let query = {'_id': id};
         Client.findOneAndUpdate(query, body, {upsert: true}).then((doc) => {
             done(null, doc);
        }).catch((err) => {
            done(generateErrorJSON(err.message, err));
        });
    }
}



