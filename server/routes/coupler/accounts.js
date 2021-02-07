const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/user/data', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/accounts/data`,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}` },
            method:'get',
        })
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(await response.json())
})


router.get('/dashboard', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/accounts/dashboard/${process.env.GUILD_ID}`,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}` },
            method:'get',
        })
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(await response.json())
})

router.get('/dashboard/name/:option', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/accounts/dashboard/name/${req.params.option}`,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}` },
            method:'get',
        })
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    var d = await respons.json()
    return res.status(200).json(d)
})


router.get('/dashboard/supportEmail/:option', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/accounts/dashboard/supportEmail/${req.params.option}`,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}` },
            method:'get',
        })
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(await response.json())
})


router.get('/dashboard/logo/:option', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/accounts/dashboard/logo/${req.params.option}`,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}` },
            method:'get',
        })
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(await response.json())
})


router.get('/dashboard/payment/:option', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/accounts/dashboard/payment/${req.params.option}`,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}` },
            method:'get',
        })
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(await response.json())
})

router.get('/dashboard/background/:option', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/accounts/dashboard/background/${req.params.option}`,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}` },
            method:'get',
        })
        console.log(response)
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(await response.json())
})

router.get('/dashboard/description/:option', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/accounts/dashboard/description/${req.params.option}`,{
            headers:{ apikey: process.env.API_KEY, authorization:`Bearer ${req.signedCookies['jwt.access']}` },
            method:'get',
        })
        console.log(response)
    }catch{
        return res.status(400).end()
    }
    if(response.status == 403) return res.status(403).send("unauthorized")
    return res.status(200).json(await response.json())
})

router.get('/stats', async (req,res) => {
    try{
        var response = await fetch(process.env.domain + `/api/v${process.env.API_VERSION}/accounts/stats`,{
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
