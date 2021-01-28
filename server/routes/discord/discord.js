const express = require('express');
const router = express.Router();
const Discord = require('discord.js');
const DiscordOauth2 = require("discord-oauth2");
const client = new Discord.Client();
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

const oauth = new DiscordOauth2({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	redirectUri: process.env.REDIRECT_URI,
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

router.get('/data', async (req, res) => {
    var user = await oauth.getUser(req.cookies.get('key')) 
    // var response = await fetch(process.env.domain + '/api/v1/user/?id=' + user.id,{
        // method:'get',
    // })


    return res.json({
        email:user.email,
        key:'On20a7sFfh8bZ1c1RrJUyIsSOmFZg5',
        dateJoined:Math.floor(Date.now() / 1000),
        discordImage:`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
        name:user.username,
        discrim:user.discriminator
    })
})

router.get('/guild/data/:guild', async (req, res) => {
    const guildData = await client.guilds.fetch(req.params.guild)
    return res.json(guildData)
})

router.get('/guild/roles', async (req, res) => {
    const guildData = client.guilds.cache.toJSON()[0]
    const guildRoles = guildData.roles


    var roles = []
    for(var i =0; i<guildRoles.length; i++)
    {
        try {
            let r = (await client.guilds.fetch(guildData.id)).roles.cache.get(guildRoles[i])
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

    // const id = guildData.id
    // const iconUrl = guildData.iconURL
    // const name = guildData.name

    return res.json({roles:roles})

})



module.exports = router
