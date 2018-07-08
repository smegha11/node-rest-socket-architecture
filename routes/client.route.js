/**
 * Created by lcom59 on 3/28/2018.
 */
const {Router} = require('express');
const router = Router();
const {post, getAll, get, put} = require('../controllers/client.controller');
const {isValidObjectId, generateErrorJSON} = require('../shared/common');

router.post('/', (req, res) => {
    post(req.body, (err, result) => {
        if (err) {
            res.json(err).status(400);
        }
        else {
            res.json(result).status(201);
        }
    });
});

router.get('/', (req, res) => {
    getAll((err, result) => {
        if (err) {
            res.json(err).status(400);
        }
        else {
            res.json(result).status(200);
        }
    });
});

router.get('/:id', (req, res) => {
    // check id whether it is object id.
    if (isValidObjectId(req.params.id)) {
        get(req.params.id, (err, result) => {
            if (err) {
                res.json(err).status(400);
            }
            else {
                res.json(result).status(200);
            }
        });
    }
    else {
        res.json(generateErrorJSON("Invalid ObjectID", {})).status(400);
    }
});

router.put('/:id', (req, res) => {
    if (isValidObjectId(req.params.id)) {
        put(req.params.id, req.body, (err, result) => {
            if (err) {
                res.json(err).status(400);
            }
            else {
                res.json(result).status(200);
            }
        })
    }
});


module.exports = router;