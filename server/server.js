const express = require('express');
const session = require('express-session');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const cookies = require('cookies');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@dashboard-cluster.gkzme.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {useNewUrlParser:true, useUnifiedTopology: true })
mongoose.Promise = global.Promise;

app.use(
    session({
        name: 'dashboard',
        secret: process.env.SESSION_SECRET,
        resave:false,
        cookie:{
            sameSite:true,
            httpOnly:true,
            secure: true,
            maxAge: 3600000
        }
    })
)

app.use(express.static(__dirname + '../../build'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookies.express());


//rotues
app.use(`/api/v${process.env.API_VERSION}/users`,require('./routes/api/user'));
app.use(`/api/v${process.env.API_VERSION}/restocks`,require('./routes/api/restocks'));
app.use(`/api/v${process.env.API_VERSION}/plans`,require('./routes/api/plans'));
app.use(`/api/v${process.env.API_VERSION}/accounts`,require('./routes/api/accounts'));

app.use(`/discord/`,require('./routes/discord/discord'));
app.use(`/discord/`,require('./routes/discord/auth'));
app.use(`/stripe/`,require('./routes/stripe/stripe'));

app.use(`/`,require('./routes/routes.js'));

app.listen(process.env.PORT_SERVER, () => console.log(`http://127.0.0.1:${process.env.PORT_SERVER}`))
