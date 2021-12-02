const express = require('express');
const session = require('express-session');
const http = require('http');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const cookies = require('cookies');
const mongoose = require('mongoose');
// const MongoStore = require('connect-mongo')(session)
const cookieParser = require('cookie-parser');
const checker = require('./routes/stripe/checker')
var busboy = require('connect-busboy') //optional
const fileUpload = require('express-fileupload'); //optional
const cluster = require('cluster')
// const numCPUs = require('os').cpus().length
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017', {useNewUrlParser:true, useUnifiedTopology: true })
// mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@dashboard-cluster.gkzme.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {useNewUrlParser:true, useUnifiedTopology: true })
mongoose.Promise = global.Promise;



let workers = []
const setupWorkerProcesses = () => {
    // to read number of cores on system
    let numCores = require('os').cpus().length;
    console.log('Master cluster setting up ' + numCores + ' workers');

    // iterate on number of cores need to be utilized by an application
    // current example will utilize all of them
    for(let i = 0; i < numCores; i++) {
        // creating workers and pushing reference in an array
        // these references can be used to receive messages from workers
        workers.push(cluster.fork());

        // to receive messages from worker process
        workers[i].on('message', function(message) {
            // console.log(message);
        });
    }

    // process is clustered on a core and process id is assigned
    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is listening');
    });

    // if any of the worker process dies then start a new one by simply forking another one
    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        // console.log('Starting a new worker');
        cluster.fork();
        workers.push(cluster.fork());
        // to receive messages from worker process
        workers[workers.length-1].on('message', function(message) {
            console.log(message);
        });
    });
};



const setUpExpress = () => {
    app.server = http.createServer(app);
    app.use(
        session({
            name: 'dashboard',
            secret: process.env.SESSION_SECRET,
            resave:false,
            saveUninitialized: true,
            cookie:{
                sameSite:false,
                httpOnly:true,
                secure: false,
                maxAge: 3600000
            }
            // store: new MongoStore( { mongooseConnection: mongoose.connection } )
        })
    )
    
    app.set('views',__dirname); //optional
    app.set('view engine','ejs'); //optional
    
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(__dirname + '../../build'));
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookies.express());
    app.use(busboy()); //optional
    app.use(fileUpload()); //optional
    
    //rotues
    app.use(`/api/v${process.env.API_VERSION}/users`,require('./routes/api/user'));
    app.use(`/api/v${process.env.API_VERSION}/restocks`,require('./routes/api/restocks'));
    app.use(`/api/v${process.env.API_VERSION}/plans`,require('./routes/api/plans'));
    app.use(`/api/v${process.env.API_VERSION}/accounts`,require('./routes/api/accounts'));
    
    app.use(`/users/`,require('./routes/coupler/user'));
    app.use(`/restocks/`,require('./routes/coupler/restocks'));
    app.use(`/plans/`,require('./routes/coupler/plans'));
    app.use(`/accounts/`,require('./routes/coupler/accounts'));
    
    app.use(`/discord/`,require('./routes/discord/discord'));
    app.use(`/discord/`,require('./routes/discord/auth'));
    
    app.use(`/stripe/`,require('./routes/stripe/stripe'));
    app.use(`/stripe/`,require('./routes/stripe/webhooks'));
    app.use(`/stripe/`,require('./routes/stripe/payment'));
    app.use(`/stripe/`,require('./routes/stripe/renew'));
    
    app.use(`/`,require('./routes/routes.js'));
    
    app.use(`/`,require('./routes/extra.js')); //optional
    
    checker()
    
    app.server.listen(process.env.PORT_SERVER, () => console.log(`http://127.0.0.1:${process.env.PORT_SERVER}`))

    // in case of an error
    app.on('error', (appErr, appCtx) => {
        // console.error('app error', appErr.stack);
        // console.error('on url', appCtx.req.url);
        // console.error('with headers', appCtx.req.headers);
    });
};


const setupServer = (isClusterRequired) => {

    if(isClusterRequired && cluster.isMaster) {
        setupWorkerProcesses();
    } else {
        // to setup server configurations and share port address for incoming requests
        setUpExpress();
    }
};

setupServer(true)