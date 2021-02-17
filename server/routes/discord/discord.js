const express = require('express');
const router = express.Router();
const Discord = require('discord.js');
const DiscordOauth2 = require("discord-oauth2");
const client = new Discord.Client();
const authorize = require('../../auth-middleware')
const fetch = require('node-fetch');
const btoa = require('btoa')


const oauth = new DiscordOauth2({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	redirectUri: process.env.REDIRECT_URI,
});


router.get('/data', async (req, res) => {
    try {

        try{
            var user = await oauth.getUser(req.signedCookies['key'] || req.headers.key) 
            var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/users?id=${user.id}`,{
                headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}`  || req.headers.authorization,  refresh:req.signedCookies['jwt.refresh']},
                method:'get',
            })
            var response2 = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/accounts/dashboard/${process.env.GUILD_ID}`,{
                headers:{ apikey: process.env.API_KEY },
                method:'get',
            })
        }catch(e){
            console.log(e)
            return res.status(400).end()
        }
        var responseBody2 = null;
        try{
            responseBody2 = await response2.json()
        }catch{}
        if(response.ok) {
            var responseBody = await response.json()
    
            var key = ''
            var cusId = ''
            var subId = ''
            try{
                key = responseBody[0].key
                cusId = responseBody[0].customerId
                subId = responseBody[0].subscriptionId
            }catch{
                key = 'n/a'
                cusId = 'n/a'
            }

            var status = false
            try{
                var response3 = await fetch(process.env.domain + `/stripe/sub/status/${subId}`,{
                    headers:{ apikey: process.env.API_KEY },
                    method:'get',
                })
                status = await response3.json()
            } catch(e){}

            try{
                await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/users/update?user=${btoa(user)}`,{
                    headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}`  || req.headers.authorization,  refresh:req.signedCookies['jwt.refresh']},
                    method:'get',
                })
            }catch{}

            return res.json({
                customerId:cusId,
                email:user.email,
                key:key,
                dateJoined:Math.floor(Date.now() / 1000),
                discordImage:`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
                name:user.username,
                discrim:user.discriminator,
                bg:responseBody2[0].backgroundUrl || 'empty',
                renewReq:status
            })
        } else {
            return res.json({
                email:user.email,
                key:'n/a',
                dateJoined:Math.floor(Date.now() / 1000),
                discordImage:`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
                name:user.username,
                bg:responseBody2[0].backgroundUrl || 'empty',
                discrim:user.discriminator
            })
        }
        

    } catch(e) {
        console.log(e)
        return res.status(403).send("unauthorized")
    }
})

router.get('/guild/data/:guild', authorize(),async (req, res) => {
    const guildData = await client.guilds.fetch(req.params.guild)
    return res.json(guildData)
})

 
router.get('/guild/roles', async (req, res) => {
    try{
        // const guildData = client.guilds.cache.toJSON()[0]
        const guildData = (await client.guilds.fetch(process.env.GUILD_ID)).toJSON()
        const guildRoles = guildData.roles


        var roles = []
        for(var i =0; i<guildRoles.length; i++)
        {
            try {
                let r = (await client.guilds.fetch(process.env.GUILD_ID)).roles.cache.get(guildRoles[i])
                let colour = parseInt(r['color']).toString(16)
                if(colour == '0') {
                    colour = '000000'
                }
                roles.push({
                    value:guildRoles[i],
                    label:r['name'],
                    color: '#' + colour
                    // color:parseInt(r['color']).toString(16)
                })
            }catch(e){
                console.log(e)
            }
        }


        return res.json({roles:roles})
    }catch(e){
        console.log(e)
        return res.status(404).end()
    }

})



client.login(process.env.BOT_TOKEN)

module.exports = router
