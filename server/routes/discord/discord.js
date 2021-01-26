const express = require('express');
const router = express.Router();
const {pool, generate} = require('../../utils.js')
const Discord = require('discord.js');
const client = new Discord.Client();


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

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


client.login(process.env.BOT_TOKEN);

module.exports = router
