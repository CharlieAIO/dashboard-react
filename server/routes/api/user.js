const express = require('express');
const router = express.Router();
const {pool, generate, signAccess} = require('../../utils.js')
const authorize = require('../../auth-middleware')
const authorize2 = require('../../auth-middleware-2')
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const Stripe = require('stripe');
const { Client } = require("discord.js")
const atob = require('atob')

const stripe = Stripe(process.env.STRIPE_SECRET);

const client3 = new Client();

function find(name,query,cb) {
    mongoose.connection.db.collection(name, function(err, col) {
        if(err) find(name,query,cb)
        col.find(query).toArray(cb)
    })
}


router.get('/', authorize(),async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {

        find('users', `discord: { id: "${req.data.user}"}`, async function (err, data) {
            if(err){
                return res.status(400).end()
            }
            var admins = []
            for(var i =0; i < data.length; i++) admins.push(data[i].discord.id)
            if(admins.includes(req.data.user)) {
                
                try{
                    var results;
                    if (req.query.id) results = await pool.query(`SELECT * FROM users WHERE "discordId" = ${req.query.id}`)
                    else results = await pool.query('SELECT * FROM users')
        
                    var results2 = await pool.query(`SELECT * FROM plans WHERE "planId" = '${results.rows[0].plan}'`)
                    var roles = []
                    if(results2.rows.length > 0) {
                        var r = JSON.parse(results2.rows[0].role)
                        for(var i = 0; i < r.length; i++) {
                            roles.push(r[i].value)
                        }
                    }
        
                    results.rows[0].roles = roles
        
                    
                    return res.status(200).json(results.rows)
                }catch(e){
                    return res.status(400).end()
                }

            }else {
                try{
                    var results = await pool.query(`SELECT * FROM users WHERE "discordId" = ${req.data.user}`)
                    if(results.rows.length > 0) {
                        return res.status(400).end()
                    }
                    
                    var results2 = await pool.query(`SELECT * FROM plans WHERE "planId" = '${results.rows[0].plan}'`)
                    var roles = []
                    if(results2.rows.length > 0) {
                        var r = JSON.parse(results2.rows[0].role)
                        for(var i = 0; i < r.length; i++) {
                            roles.push(r[i].value)
                        }
                    }
        
                    results.rows[0].roles = roles
        
                    
                    return res.status(200).json(results.rows)
                }catch{
                    return res.status(400).end()
                }
            }
        });

    

        
    } else {
        return res.status(403).end()
    }

})




router.get('/:key',async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {

        try{
            var results;
            if (req.params.key) results = await pool.query(`SELECT * FROM users WHERE "key" = '${req.params.key}'`)
            if(results.rows.length > 0) return res.status(200).json(results.rows[0])
            else return res.status(400).end()
            
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
                'INSERT INTO users values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',
                query
            ) 
            return res.status(200).json({response:"added", key:query[0]})
    
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
                {
                    await pool.query(
                        'UPDATE users SET "discordId" = $1, "discordName" =  $2, "discordImage" = $3, "email" = $4, "dateJoined" = $5 WHERE "key" = $6 ',
                        [req.body.discordId, req.body.discordName, req.body.discordImage, req.body.email, Math.floor(Date.now() / 1000), req.body.key]
                    ) 
    
                    var results2 = await pool.query(`SELECT * FROM plans WHERE "planId" = '${result.rows[0].plan}'`)
                    var roles = []
                    if(results2.rows.length > 0) {
                        var r = JSON.parse(results2.rows[0].role)
                        for(var i = 0; i < r.length; i++) {
                            roles.push(r[i].value)
                        }
                    }
                    else {
                        return res.status(200).json({response:"bound", roles:roles})
                    }

                } 
                else {
                    return res.status(400).end()
                }
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

// Bind User to Database
router.get('/update', authorize(),async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        try{
            var user = atob(req.query.user)
            var result = await pool.query(`SELECT * FROM users WHERE "discordId" = ${user.id}`)
            
            if(result.rows.length > 0) {
                if(result.rows[0].discordId.toString() != '123456789')
                {
                    await pool.query(
                        'UPDATE users SET "discordName" =  $1, "discordImage" = $2, "email" = $3 WHERE "discordId" = $4 ',
                        [`${user.username}#${user.discriminator}`,`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,user.email,user.id]
                    ) 
    
                    
                    return res.status(200).end()

                } 
                else {
                    return res.status(400).end()
                }
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
router.post('/unbind', authorize(),async (req, res) => {
    try{
        var results = await pool.query(`SELECT * FROM users WHERE "key" = '${req.body.key}'`)
        
        if(results.rows.length > 0) {
            if(results.rows[0].discordId.toString() != '123456789') {

                var unbindable = false;
                try{
                    var results2 = await pool.query(`SELECT * FROM plans WHERE "planId" = '${results.rows[0].plan}'`)
                    unbindable = results2.rows[0].unbindable
                }catch(e){
                    console.log(e)
                }

                if(unbindable == false) {
                    return res.status(400).end()
                }
                else {

                    try{
                        var resultRoles = JSON.parse(results2.rows[0].role)
                        var guild = (await client3.guilds.fetch(process.env.GUILD_ID))
                        for(var i =0; i < resultRoles.length; i++)
                        {
                            var guildUser = await guild.members.fetch(results.rows[0].discordId);
                            for(var i =0; i<resultRoles.length; i++) {
                                guildUser.roles.remove(resultRoles[i].value).then({}).catch(e => console.log(e))
                            }
                        }
                    }catch{}

                    await pool.query(
                        'UPDATE users SET "discordId" = $1, "discordName" =  $2, "discordImage" = $3, "email" = $4, "dateJoined" = $5 WHERE "key" = $6 ',
                        [123456789, 'empty', '', 'empty', 0, results.rows[0].key]
                    ) 
    
                    try {
                        const paymentMethods = await stripe.paymentMethods.list({
                            customer: results.rows[0].customerId,
                            type: 'card',
                            limit:100
                        });
                        for(var i = 0; i < paymentMethods.data.length; i++)
                        {
                            await stripe.paymentMethods.detach(paymentMethods.data[i].id);
                        }
                    }catch(e){
                        console.log(e)
                    }
                    return res.status(200).json({response:"unbound"})

                }
                
            }
            else {
                return res.status(400).end()
            }
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
            var result = await pool.query(`SELECT * FROM users WHERE "discordId" = ${req.params.id}`)
            if(result.rows.length > 0) {
                if(result[0].discordId.toString() != '123456789')
                {
                    await pool.query(
                        `DELETE FROM users WHERE "discordId" = ${req.params.id}`
                    )
                    
                    var deleted
                    try{
                        deleted = await stripe.customers.del(result.rows[0].customerId)
                    }catch{}


    
                    if(deleted.deleted == true) return res.status(200).json({response:"deleted"})
                    else return res.status(400).end()
                }
                else {
                    return res.status(400).end()
                }
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


// Delete User from Database
router.get('/delete/uuid/:id', async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {

        try{
            var result = await pool.query(`SELECT * FROM users WHERE "id" = '${req.params.id}'`)
            if(result.rows.length > 0) {
                await pool.query(
                    `DELETE FROM users WHERE "id" = '${req.params.id}'`
                )
                
                var deleted = true
                try{
                    deleted = await stripe.customers.del(result.rows[0].customerId).deleted
                }catch{
                    {}
                }
                
                if(deleted == true) return res.status(200).json({response:"deleted"})
                else return res.status(400).end()
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

// Disable User in Database
router.get('/disable/:id', async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {

        try{
            var result = await pool.query(`SELECT * FROM users WHERE "discordId" = ${req.params.id}`)
            if(result.rows.length > 0) {
                if(result.rows[0].discordId.toString() != '123456789')
                await pool.query(
                    'UPDATE users SET expired = $1',
                    [true]
                ) 
                return res.status(200).json({response:"bound"})
            }
            else {
                return res.status(400).end()
            }
    
        }catch(e){
            return res.status(400).end()
        }

    } else {
        return res.status(403).end()
    }

})
/////////////////////////////////////////


// Force Unbind User from Database
router.post('/force/unbind', authorize(),async (req, res) => {
    try{
        var results = await pool.query(`SELECT * FROM users WHERE "id" = '${req.body.key}'`)
        
        if(results.rows.length > 0) {
            if(results.rows[0].discordId.toString() != '123456789') {

                try{
                    var results2 = await pool.query(`SELECT * FROM plans WHERE "planId" = '${results.rows[0].plan}'`)
                }catch(e){
                    console.log(e)
                }

                try{
                    var resultRoles = JSON.parse(results2.rows[0].role)
                    var guild = (await client3.guilds.fetch(process.env.GUILD_ID))
                    for(var i =0; i < resultRoles.length; i++)
                    {
                        var guildUser = await guild.members.fetch(results.rows[0].discordId);
                        for(var i =0; i<resultRoles.length; i++) {
                            guildUser.roles.remove(resultRoles[i].value).then({}).catch(e => console.log(e))
                        }
                    }
                }catch{}

                await pool.query(
                    'UPDATE users SET "discordId" = $1, "discordName" =  $2, "discordImage" = $3, "email" = $4, "dateJoined" = $5 WHERE "key" = $6 ',
                    [123456789, 'empty', '', 'empty', 0, results.rows[0].key]
                ) 

                try {
                    const paymentMethods = await stripe.paymentMethods.list({
                        customer: results.rows[0].customerId,
                        type: 'card',
                        limit:100
                    });
                    for(var i = 0; i < paymentMethods.data.length; i++)
                    {
                        await stripe.paymentMethods.detach(paymentMethods.data[i].id);
                    }
                }catch(e){
                    console.log(e)
                }

                return res.status(200).json({response:"unbound"})
                
            }
            else {
                return res.status(400).end()
            }
        }
        return res.status(400).end()

    }catch(e){
        return res.status(400).end()
    }

})
/////////////////////////////////////////

// Bind User to Database
router.post('/renew', authorize(),async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        try{
            var result = await pool.query(`SELECT * FROM users WHERE "key" = '${req.body.key}'`)
            

            if(result.rows.length > 0) {
                await pool.query(
                    'UPDATE users SET "customerId" = $1, "subscriptionId" =  $2 WHERE "key" = $3',
                    [req.body.cusId, req.body.subId,req.body.key]
                ) 

                var results2 = await pool.query(`SELECT * FROM plans WHERE "planId" = '${result.rows[0].plan}'`)
                var roles = []
                if(results2.rows.length > 0) {
                    var r = JSON.parse(results2.rows[0].role)
                    for(var i = 0; i < r.length; i++) {
                        roles.push(r[i].value)
                    }
                }

                
                return res.status(200).json({response:"renewed", roles:roles})
            }
            else {
                return res.status(400).end()
            }
    
        }catch(e){
            console.log(e)
            return res.status(400).end()
        }
    
    } else {
        return res.status(403).end()
    }

})
/////////////////////////////////////////


// Reset machine id in database
router.post('/machine/reset', authorize(),async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        try{
            var result = await pool.query(`SELECT * FROM users WHERE "key" = '${req.body.key}'`)
            if(result.rows.length > 0) {
                
                await pool.query(
                    'UPDATE users SET "machineId" = $1 WHERE "key" = $2',
                    ['null',req.body.key]
                )
                return res.status(200).end()
            } else {
                return res.status(400).end()
            }
            
    
        }catch(e){
            console.log(e)
            return res.status(400).end()
        }
    
    } else {
        return res.status(403).end()
    }

})
/////////////////////////////////////////

// Update machine id in database
router.post('/machine/update',async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        try{
            var result = await pool.query(`SELECT * FROM users WHERE "key" = '${req.body.key}'`)
            
            if(result.rows.length > 0) {
                if(result.rows[0].machineId == 'null' || result.rows[0].machineId == null || result.rows[0].machineId == '' || result.rows[0].machineId == 'empty') {
                    await pool.query(
                        'UPDATE users SET "machineId" =  $1 WHERE "key" = $2',
                        [req.body.machine,req.body.key]
                    )
                    return res.status(200).end()
                } else {
                    return res.status(400).end()
                }
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

// Check if machine id matches machine id in database
router.post('/machine/validate', async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        try{
            var result = await pool.query(`SELECT * FROM users WHERE "key" = '${req.body.key}'`)

            if(result.rows.length > 0) {
                if(result.rows[0].machineId == req.body.machine) {
                    return res.status(200).end()
                }
                if(result.rows[0].machineId == 'null' || result.rows[0].machineId == null || result.rows[0].machineId == '' || result.rows[0].machineId == 'empty') {
                    return res.status(201).end()
                }
                else {
                    return res.status(400).end()
                }
            }
            else {
                return res.status(404).end()
            }
    
        }catch(e){
            console.log(e)
            return res.status(400).end()
        }
    
    } else {
        return res.status(403).end()
    }

})
/////////////////////////////////////////

client3.login(process.env.BOT_TOKEN)
module.exports = router
