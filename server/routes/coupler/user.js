const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const DiscordOauth2 = require("discord-oauth2");
const {sendEmail} = require('../../utils');



const oauth = new DiscordOauth2({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	redirectUri: process.env.REDIRECT_URI,
});


router.get('/', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/users`,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}`},
            method:'get',
        })
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(await response.json())
})

router.get('/:id', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/users?id=${req.params.id}`,{
            headers:{ apikey: process.env.API_KEY, authorization: req.headers.authorization, refresh:req.headers.refresh },
            method:'get',
        })
    }catch(e){
        return res.status(400).end()
    }

    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(await response.json())
})



router.post('/add', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/users/add`,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}`, "Content-Type": "application/json" },
            method:'post',
            body:JSON.stringify({
                plan:req.body.plan,
                discordId:123456789,
                discordName:"empty",
                discordImage:"",
                email:req.body.email,
                customerId:"empty",
                subscriptionId:"empty",
                expiryDate:0,
                machineId:"empty",

            })
        })
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    var data = await response.json()
    if(data) return res.status(200).json(data)
    else return res.status(403).send("unauthorized")
})

router.post('/bind', async (req,res) => {
    try{
        var user = await oauth.getUser(req.signedCookies['key']) 

        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/users/bind`,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}`, "Content-Type": "application/json" },
            method:'post',
            body:JSON.stringify({
                key:req.body.key,
                discordId:user.id,
                discordName:`${user.username}#${user.discriminator}`,
                discordImage:`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
                email:user.email

            })
            
        })
        if(response.status == 403) return res.status(403).send("unauthorized")
        var text = await response.text()
        if(text.includes("bound")) {
            try{
                oauth.addMember({
                    accessToken: req.signedCookies['key'],
                    botToken: process.env.BOT_TOKEN,
                    guildId: process.env.GUILD_ID,
                    userId: user.id,
                    roles: JSON.parse(text).roles
                }).then(console.log).catch(e => console.log(e))
            }catch(e){}
    
            return res.status(200).json(text)
        }
        else return res.status(400).end()
        
    }catch(e){
        console.log(e)
        return res.status(400).end()
    }
})

router.post('/email', async (req,res) => {
    try{
        sendEmail(req.body.key, req.body.email)
        
    }catch(e){
        console.log(e)
        return res.status(400).end()
    }
})

router.get('/revoke/:id', async (req,res) => {
    try{
        var id = req.params.id
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/users/delete/uuid/${id}`,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}`},
            method:'get'
            
        })
        if(response.status == 403) return res.status(403).send("unauthorized")
        var text = await response.text()
        if(text.includes("deleted")) return res.status(200).json(text)
        else return res.status(400).end()
    }catch(e){
        console.log(e)
        return res.status(400).end()
    }
})


router.get('/unbind/:key', async (req,res) => {
    try{
        var key = req.params.key
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/users/unbind`,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}`, "Content-Type": "application/json"},
            method:'post',
            body:JSON.stringify({
                key:key
            })
            
        })
        var text = await response.text()
        if(response.status == 403) return res.status(403).send("unauthorized")
        if(text.includes("unbound")) return res.status(200).end()
        else return res.status(400).end()
    }catch(e){
        console.log(e)
        return res.status(400).end()
    }
})

router.get('/force/unbind/:key', async (req,res) => {
    try{
        var key = req.params.key
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/users/force/unbind`,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}`, "Content-Type": "application/json"},
            method:'post',
            body:JSON.stringify({
                key:key
            })
            
        })
        var text = await response.text()
        if(response.status == 403) return res.status(403).send("unauthorized")
        if(text.includes("unbound")) return res.status(200).end()
        else return res.status(400).end()
    }catch(e){
        console.log(e)
        return res.status(400).end()
    }
})


module.exports = router
