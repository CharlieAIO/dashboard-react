const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const currencyToSymbolMap = require('currency-symbol-map/map')


router.get('/', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + '/api/v1/restocks',{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}` },
            method:'get',
        })
        var body = await response.json()
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(body)
})

router.get('/get/:pswd', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + '/api/v1/restocks/get/' + req.params.pswd,{
            headers:{ apikey: process.env.API_KEY},
            method:'get'
        })
        var response2 = await fetch(process.env.domain + '/api/v1/accounts/dashboard/' + process.env.GUILD_ID,{
            headers:{ apikey: process.env.API_KEY},
            method:'get'
        })
        var body2 = await response2.json()
        var body = await response.json()
        body['name'] = body2[0].name
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(body)
})


router.get('/data/:pswd', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + '/api/v1/restocks/get/' + req.params.pswd,{
            headers:{ apikey: process.env.API_KEY},
            method:'get'
        })
        var body = await response.json()

        var response2 = await fetch(process.env.domain + '/api/v1/plans/get/' + body.planId,{
            headers:{ apikey: process.env.API_KEY},
            method:'get'
        })
        var body2 = await response2.json()
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")

    var availableStock = false
    if(body.stockRemaining > 0) {
        availableStock = true
    }


    var details = ''
    if(body2[0].type == 'recurring') {
        details = `You will be charged ${currencyToSymbolMap[body2[0].currency]}${body2[0].price} / ${body2[0].intervalType}. `
    }
    else if(body2[0].type == 'recurring+onetime-payment') {
        details = `You will be charged ${currencyToSymbolMap[body2[0].currency]}${body2[0].oneTimeAmount} and then ${currencyToSymbolMap[body2[0].currency]}${body2[0].price} / ${body2[0].intervalType}. `
    }
    else if(body2[0].type == 'lifetime') {
        details = `You will be charged ${currencyToSymbolMap[body2[0].currency]}${body2[0].price}. `
    }
    else if (body2[0].type == 'rental') {
        details = `You will be charged ${currencyToSymbolMap[body2[0].currency]}${body2[0].price}. `
    }


    return res.status(200).json({
        availableStock:availableStock,
        pricingDetails:details
    })
})



router.post('/add', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + '/api/v1/restocks/add',{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}`, "Content-Type": "application/json" },
            method:'post',
            body:JSON.stringify({
                password:req.body.password,
                stock:parseInt(req.body.stock),
                stockRemaining:parseInt(req.body.stockRemaining),
                planId:req.body.planId,
                restockMethod:'regular',
                id:req.body.id,
                planName:req.body.planName
            }),
        })
        var body = await response.json()
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(body)
})

router.get('/delete/:id', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + '/api/v1/restocks/delete/' + req.params.id,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}` },
            method:'get',
        })
        var body = await response.json()
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(body)
})




module.exports = router
