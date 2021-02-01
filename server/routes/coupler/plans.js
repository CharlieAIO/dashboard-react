const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');


router.get('/', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + '/api/v1/plans',{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}` },
            method:'get',
        })
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(await response.json())
})


router.get('/data', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + '/api/v1/plans/data',{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}` },
            method:'get',
        })
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(await response.json())
})

router.post('/add', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + '/api/v1/plans/add',{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}`, "Content-Type": "application/json" },
            method:'post',
            body:JSON.stringify({
                planName:req.body.planName,
                price:req.body.price,
                currency:req.body.priceCurrency,
                type:planType,
                role:req.body.planRole,
                interval:req.body.interval,
                intervalType:req.body.intervalType,
                planId:'',
                id:'',
                unbinding:req.body.unbinding
            }),
        })
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(await response.json())
})

router.get('/delete/:id', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + '/api/v1/plans/delete/' + req.params.id,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}` },
            method:'get',
        })
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(await response.json())
})

module.exports = router