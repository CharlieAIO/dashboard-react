const express = require('express');
const router = express.Router();
const path = require('path')
const DiscordOauth2 = require("discord-oauth2");
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch')
const { signAccess,signRefresh, verifyRefresh } = require('../utils');
const { json } = require('body-parser');


const cookieConfig = {
    httpOnly: true,
    secure: false, //true in production
    // maxAge: 10000000,
    signed: true
};


router.get('/home', async (req, res) => {
    return res.sendFile(path.resolve(__dirname, `../../build/index.html`));
})
router.get('/licenses', async (req, res) => {
    return res.sendFile(path.resolve(__dirname, `../../build/index.html`));
})
router.get('/users', async (req, res) => {
    return res.sendFile(path.resolve(__dirname, `../../build/index.html`));
})
router.get('/settings', async (req, res) => {
    return res.sendFile(path.resolve(__dirname, `../../build/index.html`));
})
router.get('/bind', async (req, res) => {
    return res.sendFile(path.resolve(__dirname, `../../build/index.html`));
})
router.get('/purchase', async (req, res) => {
    return res.sendFile(path.resolve(__dirname, `../../build/index.html`));
})
router.get('/dashboard', async (req, res) => {
    return res.sendFile(path.resolve(__dirname, `../../build/index.html`));
})


const refreshTokens = []
router.get('/refresh', async (req,res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        if(req.headers['user-agent'] == 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)') {}
        else return res.status(403).send("unauthorized")
        
        var token,refresh
        try{
            token = req.headers['authorization'].slice(7)
            refresh = req.headers['refresh']
        }catch{
            return res.status(403).send("unauthorized")
        }
        if(!token) {
            return res.status(403).send("unauthorized")
        } else {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if(err) {
                    if(err.name == 'TokenExpiredError') {
                        var verify = await verifyRefresh(refresh)

                        if(verify != null) {
                            var access = await signAccess(verify.user, verify.flags)
                            var r = verify
                            req.data = r
                            // res.clearCookie("jwt.access");
                            res.cookie('jwt.access',access, cookieConfig);
                            return res.status(200).send(access)
                        }
                        else {
                            return res.status(403).send("unauthorized")
                        }
                    } else {
                        return res.status(403).send("unauthorized")
                    }
                }

                else {
                    return res.status.json(decoded)
                    
                }
            })
        }
    }
    else {
        return res.status(403).send("unauthorized")
    }
})


module.exports = router
