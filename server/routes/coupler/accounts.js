const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');


router.get('/', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + '/api/v1/restocks',{
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
