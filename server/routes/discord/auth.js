const express = require('express');
const DiscordOauth2 = require("discord-oauth2");
const router = express.Router();
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

const oauth = new DiscordOauth2({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	redirectUri: process.env.REDIRECT_URI,
});
const oauthURL = oauth.generateAuthUrl({
    scope: ["identify", "guilds","email","guilds.join"],
    clientId:process.env.CLIENT_ID
});


router.get('/oauth', async (req, res) =>{
    res.redirect('auth/callback')
})
 

router.get('/auth/callback' , async (req, res) => {

    let code = req.query.code;

    if(code == undefined) {
        console.log(oauthURL)
        res.redirect(oauthURL)
        return
    }else{
        var oa = await oauth.tokenRequest({            
            code: code,
            scope: "identify guilds",
            grantType: "authorization_code", 
            redirectUri: process.env.REDIRECT_URI
        })
        res.cookies.set('key',oa.access_token); //session variable
        res.cookies.set('rt',oa.refresh_token)


        res.redirect(`https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=bot&permissions=8&response_type=code&redirect_uri=${process.env.DISCORD_BOT_CALLBACK_URI}&scope=identify email bot`)
        return
    }   

})

router.get('/bot/callback', async (req, res) => {
    var key;
    try{
        key = req.cookies.get('key')
    }catch{
        res.redirect('/oauth')
    }

    if(req.cookies.get('key')) {
        var user = await oauth.getUser(req.cookies.get('key')) 
        // check if user exists
        // if user doesnt exist, create user in db
        // else pass them on to check if dashboard exists
        var responseUser = await fetch(process.env.domain + '/api/v1/accounts/user/' + user.id)
        var responseBody = await responseUser.text()
        var ownerId = '';
        if ( responseBody == '[]')
        {
            // User doesnt exist
            try{
                var response = await fetch(process.env.domain + '/api/v1/accounts/add/user',{
                    headers:{ "Content-Type": "application/json" },
                    method:'post',
                    body:JSON.stringify({
                        username:user.username,
                        discriminator:user.discriminator,
                        id:user.id,
                        avatar:user.avatar,
                        email:user.email,
                        staff:false,
                        accessToken:req.cookies.get('key'),
                        refresh_token:req.cookies.get('rt'),
                    })
                })
                if(response.ok) ownerId = await response.json()[0]['id']
                else return res.redirect('/oauth')
            }catch(err) {
                return res.redirect('/oauth')
            }
        }else{
            var responseUserJson = await JSON.parse(responseBody)[0]
            ownerId = responseUserJson.id
        }

        var guildId = req.query.guild_id

        var response = await fetch(process.env.domain + '/discord/guild/data/' + guildId)
        var guildData = await response.json()

        var responseDash = await fetch(process.env.domain + '/api/v1/accounts/dashboard/' + guildId)
        var responseBody2 = await responseDash.text()
        
        if ( responseBody2 == '[]')
        {
            var subDomain = guildData.name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "and").replace(' ','and')
            try{
                var resp = await fetch(process.env.domain + '/api/v1/accounts/add/dashboard',{
                    headers:{ "Content-Type": "application/json" },
                    method:'post',
                    body:JSON.stringify({
                        name:guildData.name,
                        domain:`${subDomain}.invincible.services`,
                        guildId:guildId,
                        logoUrl:guildData.iconURL,
                        ownerID:ownerId
                    })
                })
                if(resp.ok){

                }else{
                    return res.redirect('/oauth')
                }
            }catch(err){
                return res.redirect('/oauth')
            }
        }

        var token = jwt.sign({user:ownerId,guild:guildId},process.env.JWT_SECRET,{
            expiresIn:300
        })
        res.json({
            user:user,
            guild:guildData,
            token:token
        })


    } else {
        res.redirect('/oauth')
    }
})

module.exports = router