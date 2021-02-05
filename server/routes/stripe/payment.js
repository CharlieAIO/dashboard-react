const express = require('express');
const router = express.Router();
const {pool, generate, sendEmail} = require('../../utils.js')
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);
const fetch = require('node-fetch');
var queue = require('express-queue');

var q = queue({ activeLimit: 2 })
router.post('/checkout', q, async (req, res) => {
    var response = await fetch(process.env.domain + '/api/v1/restocks/get/' + req.body.password,{
        headers:{ apikey: process.env.API_KEY},
        method:'get'
    })
    if(response.ok) {

        var responseBody = await response.json();
        var stock = parseInt(responseBody.stockRemaining)
        var plan = responseBody.planId
        if(stock !== 0) {

            if(plan) {

                var response2 = await fetch(process.env.domain + '/api/v1/plans/get/' + plan,{
                    headers:{ apikey: process.env.API_KEY},
                    method:'get'
                })
    
                if(response2.ok) {
    
                    var planBody = await response2.json() //[0]
    
                    var customer;
                    try{
                        customer = await stripe.customers.create({
                            description: `${planBody[0].type} Customer`,
                            email:req.body.email,
                            payment_method:req.body.paymentMethod.id,
                            invoice_settings:{
                                default_payment_method:req.body.paymentMethod.id
                            }
                        });
                    }catch{
                        return res.status(400).end()
                    }
    
                    if(customer) {
                        var subscription;
                        try{
                            subscription = await stripe.subscriptions.create({
                                customer: customer.id,
                                items: [
                                  {price: planBody[0].planId},
                                ],
                            });
                        }catch{
                            return res.status(400).end()
                        }

                        if(subscription.status == "active") {
                            var deductResponse = await fetch(process.env.domain + '/api/v1/restocks/deduct/' + req.body.password, {
                                headers: {apikey: process.env.API_KEY }
                            })

                            var response = await fetch(process.env.domain + '/api/v1/users/add',{
                                headers:{ apikey: process.env.API_KEY, "Content-Type": "application/json" },
                                method:'post',
                                body:JSON.stringify({
                                    plan:planBody[0].planId,
                                    discordId:123456789,
                                    discordName:"empty",
                                    discordImage:"",
                                    email:req.body.email,
                                    customerId:customer.id,
                                    subscriptionId:subscription.id,
                                    expiryDate:0,
                                    machineId:"empty",
                                })
                            })
                            if(response.ok) {
                                var b = await response.json()
                                sendEmail(b.key, req.body.email)
                                return res.status(200).json({key:b.key})
                            }
    
                            else {
                                return res.status(400).end()
                            }
                            
                        }
    
                        else {
                            return res.status(400).end()
                        }
                        
                    }
    
                    else {
                        return res.status(400).end()
                    }
                }
    
                else {
                    return res.status(400).end()
                }
            }
    
            else {
                return res.status(400).end()
            }
        }
        else {
            return res.status(400).end()
        }
    }

    else {
        return res.status(400).end()
    }
      
})

module.exports = router
