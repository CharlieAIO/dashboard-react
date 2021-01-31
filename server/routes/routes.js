const express = require('express');
const router = express.Router();
const path = require('path')
const DiscordOauth2 = require("discord-oauth2");
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch')

const oauth = new DiscordOauth2({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	redirectUri: process.env.REDIRECT_URI,
});

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


router.get('/dashboard', async (req, res) => {
    // const response = await fetch(process.env.domain + '/discord/data', {
    //     headers:{ key: req.signedCookies['key'], authorization:`Bearer ${req.signedCookies['jwt.access']}` },
    // });
    // if(response.ok) {
    //     var resData = await response.json()
    //     if(resData.key == "n/a") {
    //         return res.redirect('/bind')
    //     }
    //     return res.sendFile(path.resolve(__dirname, `../../build/index.html`));
    // } else {
    //     return res.redirect('/bind')
    // }
    return res.sendFile(path.resolve(__dirname, `../../build/index.html`));
})


const refreshTokens = []
router.get('/refresh', async (req,res) => {
    const refreshToken = req.body.token;
    if(!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res.status(403).send('unauthorized')
    }
    
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
        if(!err){
            const accessToken = jwt.sign({user:user.id, flags:user.flags}, process.env.JWT_SECRET, {
                expiresIn:"20s"
            })
            res.cookies.set('jwt.access',accessToken)
            return res.status(200).end()
        } else {
            return res.status(403).send('unauthorized')
        }
    })
})


module.exports = router
