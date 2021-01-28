const express = require('express');
const router = express.Router();
const path = require('path')
const DiscordOauth2 = require("discord-oauth2");
const jwt = require('jsonwebtoken');

const oauth = new DiscordOauth2({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	redirectUri: process.env.REDIRECT_URI,
});

router.get('/home', async (req, res) => {
    res.sendFile(path.resolve(__dirname, `../../build/index.html`));
})
router.get('/licenses', async (req, res) => {
    res.sendFile(path.resolve(__dirname, `../../build/index.html`));
})
router.get('/users', async (req, res) => {
    res.sendFile(path.resolve(__dirname, `../../build/index.html`));
})
router.get('/settings', async (req, res) => {
    res.sendFile(path.resolve(__dirname, `../../build/index.html`));
})

router.get('/dashboard', async (req, res) => {
    res.sendFile(path.resolve(__dirname, `../../build/index.html`));
})


router.get('/token', async (req,res) => {
    if(req.get('authorization') == process.env.AUTHORIZATION) {
        var key = req.cookies.get('key')
        if(key){
            var user = await oauth.getUser(req.cookies.get('key')) 

            var accessToken = jwt.sign({user:user.id, discrim:user.discriminator, flags:user.flags},process.env.JWT_SECRET,{
                expiresIn:"5s"
            })
            var refreshToken = jwt.sign({user:user.id, discrim:user.discriminator, flags:user.flags},process.env.JWT_SECRET,{
                expiresIn:"7d"
            })
            res.cookies.set('jwt.access',token);
            return res.status(200).end()
        }
        else{
            return res.status(403).end()
        }
    }else{
        return res.status(403).end()
    }
})

const refreshTokens = []
router.get('/refresh', async (req,res) => {
    const refreshToken = req.body.token;
    if(!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res.status(403).send('unauthorized')
    }
    
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
        if(!err){
            const accessToken = jwt.sign({user:user.id, discrim:user.discriminator, flags:user.flags}, process.env.JWT_SECRET, {
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
