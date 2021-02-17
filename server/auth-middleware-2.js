const jwt = require('jsonwebtoken');
const { signAccess,signRefresh, verifyRefresh } = require('./utils');
// const express = require('express');
const cookieConfig = {
    httpOnly: true,
    secure: false, //true in production
    // maxAge: 10000000,
    signed: true
};

module.exports = () => {
    return(req, res, next) => {
        if(req.headers['user-agent'] == 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)') {}
        else return res.status(403).send("unauthorized")
        
        var token,refresh
        try{
            token = req.headers['authorization'].slice(7)
            refresh = req.headers['refresh']
        }catch{
            return res.status(403).send("unauthorized")
        }
        if(!token) {
            return res.status(403).send("unauthorized")
        } else {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                req.data = decoded
                next()
            })
        }
    }
}