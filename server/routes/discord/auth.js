const express = require('express');
const DiscordOauth2 = require("discord-oauth2");
const router = express.Router();
const fetch = require('node-fetch');
const { signAccess,signRefresh } = require('../../utils.js');

const cookieConfig = {
    httpOnly: true,
    secure: false, //true in production
    // maxAge: 10000000,
    signed: true
};
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
 

const refreshTokens = []
router.get('/auth/callback' , async (req, res) => {
    let code = req.query.code;
    if(code == undefined) {
        res.redirect(oauthURL)
        return
    }else{

        var formBody = []
        var body = {client_id:process.env.CLIENT_ID,client_secret:process.env.CLIENT_SECRET,code: code,scope: "identify",grant_type: "authorization_code", redirect_uri: process.env.REDIRECT_URI}
        for (var property in body) formBody.push(encodeURIComponent(property) + "=" + encodeURIComponent(body[property]));
        formBody = formBody.join("&");
        
        


        try{

            var oa = await fetch("https://discord.com/api/v6/oauth2/token",{
                method:'POST',
                body:formBody,
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            oa = await oa.json()
            if(!oa.error) {
                res.cookie('key',oa.access_token, cookieConfig);

                var user = await oauth.getUser(oa.access_token) 


                var accessToken = await signAccess(user.id, user.flags)
                var refreshToken = await signRefresh(user.id, user.flags)
                res.cookie('jwt.access',accessToken, cookieConfig);
                res.cookie('jwt.refresh',refreshToken, cookieConfig);
                // refreshTokens.push(refreshToken)
            
            }else return res.redirect('/')

        }catch(e){
            // console.log(e)
            return res.redirect('/')
        }


        // res.redirect(`https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=bot&permissions=8&response_type=code&redirect_uri=${process.env.DISCORD_BOT_CALLBACK_URI}&scope=identify email bot`)
        return res.redirect('/dashboard')
    }   

})




router.get('/bot/callback', async (req, res) => {
    var key;
    try{
        key = req.signedCookies['key']
    }catch{
        res.redirect('/discord/oauth')
    }

    if(req.signedCookies['key']) {
        var user = await oauth.getUser(req.signedCookies['key']) 
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
                        accessToken:req.signedCookies['key'],
                        refresh_token:req.session.rt,
                    })
                })
                if(response.ok) ownerId = await response.json()[0]['id']
                else return res.redirect('/discord/oauth')
            }catch(err) {
                return res.redirect('/discord/oauth')
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
                    return res.redirect('/discord/oauth')
                }
            }catch(err){
                return res.redirect('/discord/oauth')
            }
        }

        res.json({
            user:user,
            guild:guildData
        })


    } else {
        res.redirect('/discord/oauth')
    }
})

module.exports = router