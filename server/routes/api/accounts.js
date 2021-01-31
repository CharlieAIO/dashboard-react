const express = require('express');
const router = express.Router();
const {generateNoNumbers} = require('../../utils.js')
const authorize = require('../../auth-middleware')
const mongoose = require('mongoose');
const Account = require('../../models/account')
const User = require('../../models/user')
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../../utils')
const fs = require('fs');
const getPort = require('get-port');


function find(name,query,cb) {
    mongoose.connection.db.collection(name, function(err, col) {
        if(err) console.log(err)
        col.find(query).toArray(cb)
    })
}


router.get('/data', async (req, res) => {
    res.json({
        name:process.env.APP_NAME,
        serverImage:process.env.SERVER_IMAGE
    })
    
})


router.get('/user/:discordId', async (req, res) => {
    var query = "discord: { id: req.params.discordId.toString()}"
    find('users', query, function (err, data) {
        if(err){
            res.send({
                status:400,
                error:err,
            })
            return;
        }
        return res.send(data)
    });
})
router.get('/dashboard/:guildId', async (req, res) => {
    var query = { guild: req.params.guildId }
    find('accounts', query, function (err, data) {
        if(err){
            res.send({
                status:400,
                error:err,
            })
            return;
        }
        return res.send(data)
    });
})


// Add Dashboard User account to Database
router.post('/add/user', async (req, res) => {
    var body = req.body
    User.create({
        userName:`${body.username}#${body.discriminator}`,
        imageUrl:`https://cdn.discordapp.com/avatars/${body.id}/${body.avatar}.png`,
        email:body.email,
        id:uuidv4(),
        admin:false,
        staff:body.staff,
        lastLogin:Date.now(),
        discord:{
            accessToken:body.accessToken,
            avatar:body.avatar,
            discriminator:body.discriminator,
            id:body.id,
            refresh_token:body.refresh_token,
            username:body.username
        }
    }).then( (user) => {
        return res.status(200).json({message:"success"}).end()
    }).catch((error) => {
        console.log(error)
        return res.status(400).end()
    })
})
/////////////////////////////////////////



// Add Dashboard account to Database
router.post('/add/dashboard', async (req, res) => {
    var dashId = generateNoNumbers(25)
    Account.create({
        name:req.body.name,
        domain:req.body.domain,
        guild:req.body.guildId,
        ownerId:req.body.ownerID,
        stripeAccount:"empty",
        verificationStatus:"unverified",
        supportEmail:"support@example.com",
        id:dashId,
        settings:{
            payments:{
                failedPaymentOption:"1"
            }
        },
        staff:[],
        branding:{
            logoUrl:req.body.logoUrl
    
        }
    }).then( async  (dash) => {
        const portNew = await getPort()
        console.log(portNew)
        var envData =
`
SESSION_SECRET=0c94eecd8e2f2d7cb9d5aa12bae58ae76522acf8603ac13bb100afb44c0b341971bf6e86cb38d8745223ecb8a71cfb6476ea3cdab1e3281ce50c5cfdbf69970d
PORT_SERVER=${portNew}
API_KEY=1
API_VERSION=1
APP_NAME=${req.body.name}
SERVER_IMAGE=${req.body.logoUrl}
MONGO_USER=charlie
MONGO_PASS=FQ88O4AuyIS1DDP4
MONGO_DB=dashboard
DB_USERNAME=doadmin
DB_PASSWORD=c0mzf8maodoy9yqw
DB_NAME=${dashId}
DB_PORT=25060
DB_HOST=invincible-services-dashboards-db-do-user-7398952-0.b.db.ondigitalocean.com
NODE_TLS_REJECT_UNAUTHORIZED=0
STRIPE_PUBLIC=
STRIPE_SECRET=
REDIRECT_URI_STRIPE=http://127.0.0.1:4000/stripe/oauth/uri
CLIENT_ID_STRIPE=
CLIENT_ID=802634543621210163
CLIENT_SECRET=9K2mfEh63Sf_GerHHSvrLSC3muzs7mjp
REDIRECT_URI=http://127.0.0.1:4000/discord/auth/callback
DISCORD_BOT_CALLBACK_URI=http://127.0.0.1:4000/discord/bot/callback
BOT_TOKEN=ODAyNjM0NTQzNjIxMjEwMTYz.YAyFqw.5UOBR5jYLmSaUC-r94CXFKmkQm
domain=http://127.0.0.1:${portNew}
JWT_SECRET=29c09becdab446f694b0de21146ce601230e594b08bdc11ab64fab8261e7c07fd0eb6758f5fb24147836a8e1281c79ffc715be86f60ccddaed5cee6756ed9d88af4743f5591b9ce68d0697e71b64903fc427e971fb0e7c6c1e52f440cbe9965d03adf649a704f62d46b44e9de5dd4eb05cb76f889d1698fa890a2ed42d382ba0
        `
        await fs.writeFileSync(`${dashId}.env`, envData, async (err) => {
            if(err)console.log(err)
        })
        await pool.query(
            `CREATE DATABASE ${dashId}`
        ) 
        

        
        return res.status(200).json({message:"success"}).end()
    }).catch((error) => {
        console.log(error)
        return res.status(400).end()
    })
})
/////////////////////////////////////////

module.exports = router
