const express = require('express');
const router = express.Router();
const Discord = require('discord.js');
const DiscordOauth2 = require("discord-oauth2");
const client = new Discord.Client();
const fetch = require('node-fetch');

const oauth = new DiscordOauth2({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	redirectUri: process.env.REDIRECT_URI,
});


router.get('/data', async (req, res) => {
    try {
        var user = await oauth.getUser(req.signedCookies['key'] || req.headers.key) 
        try{
            var response = await fetch(process.env.domain + '/users/' + user.id,{
                headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}`  || req.headers.authorization },
                method:'get',
            })
        }catch{
            return res.status(400).end()
        }
        if(response.ok) {
            var responseBody = await response.json()
            var key = ''
            var cusId = ''
            try{
                key = responseBody[0].key
                cusId = responseBody[0].customerId
            }catch{
                key = 'n/a'
                cusId = 'n/a'

            }

            return res.json({
                customerId:cusId,
                email:user.email,
                key:key,
                dateJoined:Math.floor(Date.now() / 1000),
                discordImage:`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
                name:user.username,
                discrim:user.discriminator
            })
        } else {
            return res.json({
                email:user.email,
                key:'n/a',
                dateJoined:Math.floor(Date.now() / 1000),
                discordImage:`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
                name:user.username,
                discrim:user.discriminator
            })
        }
        

    } catch(e) {

        return res.status(403).send("unauthorized")
    }
})

router.get('/guild/data/:guild', async (req, res) => {
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
