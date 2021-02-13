const express = require('express');
const router = express.Router();
const {pool, generate, sendEmail} = require('../../utils.js')
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);
const fetch = require('node-fetch');
const DiscordOauth2 = require("discord-oauth2");
// var queue = require('express-queue');

const oauth = new DiscordOauth2({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	redirectUri: process.env.REDIRECT_URI,
});



router.post('/renew', async (req, res) => {
    try {
        var user = await oauth.getUser(req.signedCookies['key'] || req.headers.key) 
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/users?id=${user.id}`,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}`  || req.headers.authorization,  refresh:req.signedCookies['jwt.refresh']},
            method:'get',
        })
    }catch(e){
        return res.status(400).end()
    }

    if(response.ok) {

        var responseBody = await response.json()
        var subId = ''
        var planId = ''
        var email = ''
        var key = ''
        try{
            subId = responseBody[0].subscriptionId
            planId = responseBody[0].plan
            email = responseBody[0].email
            key = responseBody[0].key
        }catch{}

        try{
            var response2 = await fetch(process.env.domain + `/stripe/sub/status/${subId}`,{
                headers:{ apikey: process.env.API_KEY },
                method:'get',
            })
            var response3 = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/plans/get/${planId}`,{
                headers:{ apikey: process.env.API_KEY},
                method:'get'
            })
        } catch(e){
            return res.status(400).end()
        }

        var responseBody2 = await response2.json()
        var planBody = await response3.json()

        var newcusId = ""
        var newsubId = ""

        if(responseBody2 == true) {
            // subscription required

            var customer = null;
            try{
                customer = await stripe.customers.create({
                    description: `${planBody[0].type} Customer`,
                    email:email,
                    payment_method:req.body.paymentMethod.id,
                    invoice_settings:{
                        default_payment_method:req.body.paymentMethod.id
                    }
                });
                newcusId = customer.id
            }catch(e){
                // console.log(e)
                return res.status(400).end()
            }
            if(customer) {
                var subObject = {
                    customer: customer.id,
                    items: [
                    {price: planBody[0].planId},
                    ],
                }
                if(planBody[0].expiry != 'none' && planBody[0].expiry != null) {
                    subObject['cancel_at'] = parseInt(planBody[0].expiry)
                }
                subscription = await stripe.subscriptions.create(subObject);

                if(subscription.status != "active") {
                    await stripe.customers.del(customer.id).catch(e => {});
                    return res.status(400).end()
                }else{
                    newsubId = subscription.id
                }
                
                console.log(JSON.stringify({
                    key:key,
                    subId:newsubId,
                    cusId:newcusId
                }))
                var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/users/renew`,{
                    headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}`  || req.headers.authorization,  refresh:req.signedCookies['jwt.refresh'], "Content-Type": "application/json"},
                    method:'post',
                    body:JSON.stringify({
                        key:key,
                        subId:newsubId,
                        cusId:newcusId
                    })
                })
                console.log(response)
                var text = await response.text()
                if(text.includes("renewed")) {
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

            }

            else {
                return res.status(400).end()
            }
            
        } else {
            return res.status(400).end()
        }

    }

    else {
        return res.status(400).end()
    }
      
})

module.exports = router
