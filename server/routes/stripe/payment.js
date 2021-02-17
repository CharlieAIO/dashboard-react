const express = require('express');
const router = express.Router();
const {pool, generate, sendEmail} = require('../../utils.js')
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);
const fetch = require('node-fetch');
var queue = require('express-queue');

var q = queue({ activeLimit: 2 })
router.post('/checkout', q, async (req, res) => {
    var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/restocks/get/${req.body.password}`,{
        headers:{ apikey: process.env.API_KEY},
        method:'get'
    })
    if(response.ok) {
        var cusId = ""
        var subId = ""

        var responseBody = await response.json();
        var stock = parseInt(responseBody.stockRemaining)
        var plan = responseBody.planId
        if(stock !== 0) {

            if(plan) {

                var response2 = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/plans/get/${plan}`,{
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
                            coupon:req.body.coupon,
                            invoice_settings:{
                                default_payment_method:req.body.paymentMethod.id
                            }
                        });
                        cusId = customer.id
                    }catch(e){
                        // console.log(e)
                        return res.status(400).end()
                    }
    
                    if(customer) {
                        var subscription;
                        
                        
                        if(planBody[0].type ==  "lifetime" || planBody[0].type ==  "rental") {
                            await stripe.invoiceItems.create({
                                customer:  customer.id,
                                price: planBody[0].planId,
                            });

                            const invoice = await stripe.invoices.create({
                                customer: customer.id,
                                collection_method:"charge_automatically"
                            });
                            if(invoice.id) {
                                const invoicePaid = await stripe.invoices.pay(invoice.id);
                                if(invoicePaid.amount_due == invoicePaid.amount_paid) {}
                                else {
                                    await stripe.customers.del(customer.id).catch(e => {});
                                    return res.status(400).end()
                                }
                            } else {
                                await stripe.customers.del(customer.id).catch(e => {});
                                return res.status(400).end()
                            }

                        } else {
                            try{
                                var subObject = {
                                    customer: customer.id,
                                    coupon:req.body.coupon,
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
                                    subId = subscription.id
                                }        
                            }catch(e){
                                return res.status(400).end()
                            }
                        }
                
                        if(planBody[0].oneTimeAmount != null && planBody[0].oneTimeAmount != 0 && planBody[0].oneTimeAmount != '') {
                            let price = planBody[0].oneTimeAmount;
                            if(price.includes('.')) price = price.replace('.','')
                            else price += '00'

                            var paymentIntent
                            try {
                                paymentIntent = await stripe.paymentIntents.create({
                                    amount:parseInt(price),
                                    currency: planBody[0].currency.toLowerCase(),
                                    payment_method_types: ['card'],
                                    customer:customer.id,
                                    payment_method:req.body.paymentMethod.id,
                                });
                            }catch(e){
                                await stripe.customers.del(customer.id).catch(e => {});
                                await stripe.subscriptions.del(subId).catch(e => {});
                                return res.status(400).end()
                            }

                            if(paymentIntent.id) {
                                const paymentIntentConf = await stripe.paymentIntents.confirm(
                                    paymentIntent.id
                                );
                                if(paymentIntentConf.amount_received == price) {}
                                else {
                                    await stripe.customers.del(customer.id).catch(e => {});
                                    await stripe.subscriptions.del(subId).catch(e => {});
                                    return res.status(400).end()
                                }
                            }
                            else {
                                await stripe.customers.del(customer.id).catch(e => {});
                                await stripe.subscriptions.del(subId).catch(e => {});
                                return res.status(400).end()
                            }
                        }

                        await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/restocks/deduct/${req.body.password}`, {
                            headers: {apikey: process.env.API_KEY }
                        })

                        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/users/add`,{
                            headers:{ apikey: process.env.API_KEY, "Content-Type": "application/json" },
                            method:'post',
                            body:JSON.stringify({
                                plan:planBody[0].planId,
                                discordId:123456789,
                                discordName:"empty",
                                discordImage:"",
                                email:req.body.email,
                                customerId:cusId,
                                subscriptionId:subId,
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
      
})

module.exports = router
