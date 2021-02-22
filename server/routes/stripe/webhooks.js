const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const {pool, generate} = require('../../utils.js')
const bodyParser = require("body-parser");
const { Client, MessageEmbed } = require("discord.js");
const stripe = Stripe(process.env.STRIPE_SECRET);
const fetch = require('node-fetch');

const client2 = new Client();

var successColor = '0x45e670'
var failedColor = '0xe63427'
var defaultColor = '0x242121'

client2.on("ready", () => {
    console.log(`Logged in as ${client2.user.tag}!`);
});
  

router.post('/webhook', bodyParser.raw({ type: "*/*" }), async (req, res) => {
    // if(process.env.WEBHOOK_SECRET != req.headers["stripe-signature"]) return res.status(403).end()

    var searchId;
    var query;
    if(req.body.data.object.id) {
        if(req.body.data.object.payment_method == "payment_method") searchId = req.body.data.object.customer
        else searchId = req.body.data.object.id

        if (req.body.data.object.object == 'subscription') query = 'subscriptionId'
        if (req.body.data.object.object == 'customer') query = 'customerId'
    }
    var customer = req.body.data.object.customer;
    var user;
    var roles = []
    try{
        var results = await pool.query(`SELECT * FROM users WHERE "${query}" = '${searchId}'`)
        if(results.rows[0].discordId != 123456789) user = results.rows[0]
        else res.status(404).end('user doesnt exist')

        var results2 = await pool.query(`SELECT * FROM plans WHERE "planId" = '${user.plan}'`)
        var resultRoles = JSON.parse(results2.rows[0].role)
        for(var i =0; i < resultRoles.length; i++)
        {
            roles.push(resultRoles[i].value)
        }
    }catch(e){
        console.log("webhook error")
        console.log(req.body)
        return res.json({ received: true });
    }
    

    var response = await fetch(process.env.domain + '/api/v1/accounts/dashboard/' + process.env.GUILD_ID, {
        headers:{ apikey: process.env.API_KEY },
        method:'get',
    })
    while(!response.ok) {
        response = await fetch(process.env.domain + '/api/v1/accounts/dashboard/' + process.env.GUILD_ID, {
            headers:{ apikey: process.env.API_KEY },
            method:'get',
        })
    }

    var account = await response.json()
    account = account[0]
    

    var userID = user.discordId
    var guild = (await client2.guilds.fetch(process.env.GUILD_ID))

    // console.log(req.body.type)
    switch (req.body.type) {

        // Case
        case "payment_method.detached":
            try{
                var embed = new MessageEmbed()
                .setTitle("Invincible Services Dashboard")
                .setColor(successColor)
                .setDescription(
                "Your card was removed"
                );
                var user = await client2.users.fetch(userID.toString())
                if(user) user.send(embed);
                return res.json({ received: true });
            }catch{

            }
            break;
        //////////////


        // Case
        case "payment_method.updated":
            try{
                var embed = new MessageEmbed()
                .setTitle("Invincible Services Dashboard")
                .setColor(successColor)
                .setDescription(
                "Your payment method has been updated"
                );
                var user = await client2.users.fetch(userID.toString())
                if(user) user.send(embed);
                return res.json({ received: true });
            }catch{

            }
            break;
        //////////////


        // Case
        case "payment_method.attached":
            try{
                var embed = new MessageEmbed()
                .setTitle("Invincible Services Dashboard")
                .setColor(successColor)
                .setDescription(
                "Payment method has been attached"
                );
                
                var user = await client2.users.fetch(userID.toString())
                if(user) user.send(embed);
                return res.json({ received: true });
            }catch(e){
                console.log(e)
            }
            break;
        //////////////


        // Case
        case "invoice.payment_action_required":
            try{
                var embed = new MessageEmbed()
                .setTitle("Invincible Services Dashboard")
                .setColor(defaultColor)
                .setDescription(
                "Payment Required"
                );
                var user = await client2.users.fetch(userID.toString())
                if(user) user.send(embed);
                return res.json({ received: true });
            }catch{

            }
            break;
        //////////////


        // Case
        case "invoice.payment_failed":
            try{
                var embed = new MessageEmbed()
                .setTitle("Invincible Services Dashboard")
                .setColor(failedColor)
                .setDescription(
                "Payment Failed. Your Role(s) have been removed & your key has been disabled."
                );
                var user = await client2.users.fetch(userID.toString())
                if(user) user.send(embed);
                
                //disable user
                fetch(process.env.domain + '/api/v1/users/disable/' + userID, {
                    headers:{ apikey: process.env.API_KEY },
                    method:'get',
                })

                // remove roles
                var guildUser = await guild.members.fetch(userID);
                for(var i =0; i<roles.length; i++) {
                    guildUser.roles.remove(roles[i]).then({}).catch(e => {})
                }
                return res.json({ received: true });
            }catch{

            }
            break;
        //////////////


        // Case
        case "invoice.upcoming":
            try{
                var embed = new MessageEmbed()
                .setTitle("Invincible Services Dashboard")
                .setColor(defaultColor)
                .setDescription(
                "Your subscription will be renewed soon."
                );
                var user = await client2.users.fetch(userID.toString())
                if(user) user.send(embed);
                return res.json({ received: true });
            }catch{

            }
            break;
        //////////////


        // Case
        case "invoice.payment_succeeded":
            try{
                var embed = new MessageEmbed()
                .setTitle("Invincible Services Dashboard")
                .setColor(successColor)
                .setDescription(
                "Payment Succeeded"
                );
                var user = await client2.users.fetch(userID.toString())
                if(user) user.send(embed);
                return res.json({ received: true });
                //add roles
            }catch{

            }
            break;
        //////////////

         // Case
         case "customer.subscription.updated":
            try{
                if(req.body.data.object.cancel_at == null) {
                    var embed = new MessageEmbed()
                    .setTitle("Invincible Services Dashboard")
                    .setColor(successColor)
                    .setDescription(
                    "Subscription renewed"
                    );
                    var user = await client2.users.fetch(userID.toString())
                    if(user) user.send(embed);
                }
                else {
                    var embed = new MessageEmbed()
                    .setTitle("Invincible Services Dashboard")
                    .setColor(defaultColor)
                    .setDescription(
                    "Subscription will not be renewed"
                    );
                    var user = await client2.users.fetch(userID.toString())
                    if(user) user.send(embed);

                }
                return res.json({ received: true });
            }catch{

            }
            break;
        //////////////



        // Case
        case "customer.subscription.deleted":
            try{
                var embed = new MessageEmbed()
                .setTitle("Invincible Services Dashboard")
                .setColor(failedColor)
                .setDescription(
                "Subscription Ended. Your Role(s) have been removed & your key has been disabled."
                );
                var user = await client2.users.fetch(userID.toString())
                if(user) user.send(embed);

                //disable user
                var guildUser = await guild.members.fetch(userID);
                if(account.settings.payments.failedPaymentOption.toString() == "1") {
                    // Delete key & Kick User
                    var r = await fetch(process.env.domain + '/api/v1/users/delete/' + userID, {
                        headers:{ apikey: process.env.API_KEY },
                        method:'get',
                    })
                    for(var i =0; i<roles.length; i++) {
                        guildUser.roles.remove(roles[i]).then({}).catch(e => {})
                    }
                    guildUser.kick().catch(e => {})
                }
                if(account.settings.payments.failedPaymentOption.toString() == "2") {
                    // Remove Roles & Allow User to renew
                    await fetch(process.env.domain + '/api/v1/users/disable/' + userID, {
                        headers:{ apikey: process.env.API_KEY },
                        method:'get',
                    })
    
                    // remove roles
                    
                    for(var i =0; i<roles.length; i++) {
                        guildUser.roles.remove(roles[i]).then({}).catch( (e) => console.log(e))
                    }
                }
                return res.json({ received: true });
            }catch{

            }
            break;
        //////////////

    }
    return res.json({ received: true });
})

client2.login(process.env.BOT_TOKEN);

module.exports = router
