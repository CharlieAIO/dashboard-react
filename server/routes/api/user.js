const express = require('express');
const router = express.Router();
const {pool, generate} = require('../../utils.js')
const authorize = require('../../auth-middleware')
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

function find(name,query,cb) {
    mongoose.connection.db.collection(name, function(err, col) {
        if(err) find(name,query,cb)
        col.find(query).toArray(cb)
    })
}


router.get('/', authorize(),async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        // console.log(req.data.user)
        // check if user is admin/staff
        find('users', `discord: { id: "${req.data.user}"}`, function (err, data) {
            if(err){
                return null;
            }
            if(data[0].discord.id.normalize() === req.data.user.normalize()) {
                {}
            }else {
                return res.status(403).end()
            }
        });

        try{
            var results;
            if (req.query.id) results = await pool.query(`SELECT * FROM users WHERE "discordId" = ${req.query.id}`)
            else results = await pool.query('SELECT * FROM users')
            
            return res.status(200).json(results.rows)
        }catch(e){
            return res.status(400).end()
        }
    } else {
        return res.status(403).end()
    }

})

// Add User to Database
router.post('/add', authorize(),async (req, res) => {

    if(req.get('apikey') == process.env.API_KEY) {
        // console.log(req.data.user)
        // check if user is admin/staff
        find('users', `discord: { id: "${req.data.user}"}`, function (err, data) {
            if(err){
                return null;
            }
            if(data[0].discord.id.normalize() === req.data.user.normalize()) {
                {}
            }else {
                return res.status(403).end()
            }
        });

        try{
            var query = []
            query[0] = generate(30)
            for(var i in req.body)
                query.push(req.body [i])
            
                query[10] = Math.floor(Date.now() / 1000)  //Date Created
                query[11] = 0 //Date Joined
                query[12] = uuidv4()
                query[13] = false
    
            await pool.query(
                'INSERT INTO users values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',
                query
            ) 
            return res.status(200).json({response:"added"})
    
        }catch(e){
            return res.status(400).end()
        }

    } else {
        return res.status(403).end()
    }

})
/////////////////////////////////////////

// Bind User to Database
router.post('/bind', authorize(),async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        try{
            var result = await pool.query(`SELECT * FROM users WHERE "key" = '${req.body.key}'`)
            if(result.rows.length > 0) {
                if(result.rows[0].discordId.toString() == '123456789')
                await pool.query(
                    'UPDATE users SET "discordId" = $1, "discordName" =  $2, "discordImage" = $3, "email" = $4, "dateJoined" = $5 WHERE "key" = $6 ',
                    [req.body.discordId, req.body.discordName, req.body.discordImage, req.body.email, Math.floor(Date.now() / 1000), req.body.key]
                ) 
                return res.status(200).json({response:"bound"})
            }
            return res.status(400).end()
    
        }catch(e){
            console.log(e)
            return res.status(400).end()
        }
    
    } else {
        return res.status(403).end()
    }

})
/////////////////////////////////////////

// Unbind User from Database
router.post('/unbind', async (req, res) => {
    try{
        var result = await pool.query(`SELECT * FROM users WHERE "key" = '${req.body.key}'`).rows
        if(result.length > 0) {
            if(result[0].discordId.toString() != '123456789')
            await pool.query(
                'UPDATE users SET "discordId" = $1, "discordName" =  $2, "discordImage" = $3, "email" = $4, "dateJoined" = $5 WHERE "key" = $6 ',
                [123456789, 'empty', '', 'empty', 0, results[0].key]
            ) 
            return res.status(200).json({response:"unbound"})
        }
        return res.status(400).end()

    }catch(e){
        return res.status(400).end()
    }

})
/////////////////////////////////////////

// Delete User from Database
router.get('/delete/:id', async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {

        try{
            var result = await pool.query(`SELECT * FROM users WHERE "discordId" = ${req.params.id}`).rows
            if(result.length > 0) {
                if(result[0].discordId.toString() != '123456789')
                await pool.query(
                    `DELETE FROM users WHERE "discordId" = ${req.params.id}`
                )
                
                const deleted = await stripe.customers.del(
                    result[0].customerId
                );
                if(deleted.deleted == true) return res.status(200).json({response:"deleted"})
                else return res.status(400).end()
            }
            return res.status(400).end()
    
        }catch(e){
            return res.status(400).end()
        }

    } else {
        return res.status(403).end()
    }

})
/////////////////////////////////////////

// Disable User in Database
router.get('/disable/:id', async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {

        try{
            var result = await pool.query(`SELECT * FROM users WHERE "discordId" = ${req.params.id}`).rows
            if(result.length > 0) {
                if(result[0].discordId.toString() != '123456789')
                await pool.query(
                    'UPDATE users SET expired = $1',
                    [true]
                ) 
                return res.status(200).json({response:"bound"})
            }
            return res.status(400).end()
    
        }catch(e){
            return res.status(400).end()
        }

    } else {
        return res.status(403).end()
    }

})
/////////////////////////////////////////
module.exports = router
