const express = require('express');
const router = express.Router();
const {pool} = require('../../utils')
const authorize = require('../../auth-middleware')
const mongoose = require('mongoose');
const atob = require('atob')
function find(name,query,cb) {
    mongoose.connection.db.collection(name, function(err, col) {
        if(err) {
            console.log(err)
            find(name,query,cb)
        }
        col.find(query).toArray(cb)
    })
}


router.get('/', authorize(),async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        // console.log(req.data.user)
        // check if user is admin/staff
        find('users', `discord: { id: "${req.data.user}"}`, async function (err, data) {
            if(err){
                return null;
            }
            var admins = []
            for(var i =0; i < data.length; i++) admins.push(data[i].discord.id)
            if(admins.includes(req.data.user)) {
                try{
                    var results;
                    if(req.query.password) results = await pool.query(`SELECT * FROM restocks WHERE "password" = '${req.query.password}'`)
                    else results = await pool.query('SELECT * FROM restocks')
                    
                    return res.status(200).json(results.rows)
                }catch(e){
                    return res.status(400).end()
                }
            }else {
                return res.status(403).end()
            }
        });

        
    } else {
        return res.status(403).end()
    }

})



// Add Restock to Database
router.post('/add', authorize(),async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        // console.log(req.data.user)
        // check if user is admin/staff
        find('users', `discord: { id: "${req.data.user}"}`, async function (err, data) {
            if(err){
                return null;
            }
            var admins = []
            for(var i =0; i < data.length; i++) admins.push(data[i].discord.id)
            if(admins.includes(req.data.user)) {
                try{
                    var query = []
                    for(var i in req.body)
                        query.push(req.body [i])
        
                    await pool.query(
                        'INSERT INTO restocks values ($1,$2,$3,$4,$5,$6,$7)',
                        query
                    ) 
        
                    return res.status(200).json({response:"added"})
                    
        
                }catch(e){
                    console.log(e)
                    return res.status(400).end()
                    
                }
            }else {
                return res.status(403).end()
            }
        });

    
    } else {
        return res.status(403).end()
    }

})
/////////////////////////////////////////


// Retrieve a restock
router.get('/get/:password',async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        // console.log(req.data.user)
        // check if user is admin/staff

        try{
            var response = await pool.query(
                `SELECT * FROM restocks WHERE "password" = '${atob(req.params.password)}'`
            ) 
            return res.status(200).json(response.rows[0])

        }catch(e){
            return res.status(400).end()
        }

    } else {
        return res.status(403).end()
    }

})
/////////////////////////////////////////


// Delete a restock
router.get('/delete/:id', authorize(),async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        // console.log(req.data.user)
        // check if user is admin/staff
        find('users', `discord: { id: "${req.data.user}"}`, async function (err, data) {
            if(err){
                return null;
            }
            var admins = []
            for(var i =0; i < data.length; i++) admins.push(data[i].discord.id)
            if(admins.includes(req.data.user)) {
                try{
                    await pool.query(
                        `DELETE FROM restocks WHERE "id" = '${req.params.id}'`
                    ) 
                    return res.status(200).end()
        
                }catch(e){
                    return res.status(400).end()
                }
            }else {
                return res.status(403).end()
            }
        });

        
        
    } else {
        return res.status(403).end()
    }
    

})
/////////////////////////////////////////


// Deduct Stock
router.get('/deduct/:pswd',async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        // console.log(req.data.user)
        // check if user is admin/staff

        try{
            var restock = await pool.query(`SELECT * FROM restocks WHERE "password" = '${atob(req.params.pswd)}'`)
            var stock = parseInt(restock.rows[0].stockRemaining) - 1;
            await pool.query(
                `UPDATE restocks SET "stockRemaining" = ${stock} WHERE "password" = '${atob(req.params.pswd)}'`
            ) 
            return res.status(200).end()

        }catch(e){
            console.log(e)
            return res.status(400).end()
        }
        
    } else {
        return res.status(403).end()
    }


})
/////////////////////////////////////////


module.exports = router
