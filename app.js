/**
 * Created by lcom59 on 3/7/2018.
 * Main application entry point
 * This file contains express server along with the node cluster to enchance node single thread mechanism
 */

// Include the cluster module
const cluster = require('cluster');
const express = require('express');
const mongoose = require('mongoose');
const {url} = require('./configs/database.js');
const authRoute = require('./routes/auth.route');
const clientRoute = require('./routes/client.route');
const bodyParser = require('body-parser');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const {includeAllLogs} = require('./configs/general');
const passport = require('passport');
require('./configs/passport')(passport);

const swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger/swagger.json');


let logDirectory = path.join(__dirname, 'logs');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// create a rotating write stream
let accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily you can also provide the file size limitation.
    path: logDirectory
});
let errorLogStream = rfs('error.log', {
    interval: '1d', // rotate daily you can also provide the file size limitation.
    path: logDirectory
});

// Creating the express instance
let app = express();

// Adding middlewear to express
app.use(passport.initialize());
app.use(passport.session());

// setup the logger
const logFormatter = (tokens, req, res) => {

    let log = {
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        responseLength: tokens.res(req, res, 'content-length'),
        responseTime: tokens['response-time'](req, res) + ' ms',
        remoteAddr: tokens['remote-addr'](req, res),
        remoteUser: tokens['remote-user'](req, res),
        requestHeaders: req["headers"],
        requestParams: req["params"],
        requestBody: req["body"]
    }

    return JSON.stringify(log);

}
// To include all request the logs set the flag `includeAllLogs` in true in general config.
if (includeAllLogs) {
    app.use(morgan(logFormatter, {stream: accessLogStream}))
}
// All the error logs should be added to fileSystem.
app.use(morgan(logFormatter, {
    skip: function (req, res) {
        return res.statusCode < 400
    },
    stream: errorLogStream
}));

// connect to db
mongoose.connect(url);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/auth', authRoute);
app.use('/client', clientRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        detail: err
    });
});

// Code to run if we're in the master process
if (cluster.isMaster) {
    // Count the machine's CPUs
    let cpuCount = require('os').cpus().length;
    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
    // Listen for dying workers
    cluster.on('exit', (worker) => {
        // Replace the dead worker, we're not sentimental
        console.log('Worker %d died :(', worker.id);
        cluster.fork();

    });
// Code to run if we're in a worker process
}
else {
    // Add a basic route – index page
    app.get('/', (request, response) => {
        console.log('Request to worker %d', cluster.worker.id);
        response.send('Hello from Worker ' + cluster.worker.id);
    });

    app.listen(3002);
    console.log('Worker %d running!', cluster.worker.id);
}