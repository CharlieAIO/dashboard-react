const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');


router.get('/', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/plans`,{
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
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/plans/data`,{
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

        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/plans/add`,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}`, "Content-Type": "application/json" },
            method:'post',
            body:JSON.stringify({
                planName:req.body.planName,
                price:req.body.price,
                currency:req.body.currency,
                type:req.body.type,
                role:req.body.role,
                interval:req.body.interval,
                intervalType:req.body.intervalType,
                planId:'',
                id:'',
                unbinding:req.body.unbinding,
                oneTimeAmount:req.body.oneTimeAmount
            }),
        })
    }catch(e){
        console.log(e)
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(await response.json())
})

router.get('/delete/:id', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/plans/delete/${req.params.id}`,{
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
