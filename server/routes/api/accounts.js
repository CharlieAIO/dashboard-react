const express = require('express');
const router = express.Router();
const {generateNoNumbers, pool} = require('../../utils.js')
const authorize = require('../../auth-middleware')
const authorize2 = require('../../auth-middleware-2')
const mongoose = require('mongoose');
const Account = require('../../models/account')
const User = require('../../models/user')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const atob = require('atob')
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);

function find(name,query,cb) {
    mongoose.connection.db.collection(name, function(err, col) {
        if(err) {}
        col.find(query).toArray(cb)
    })
}

function update(name,f_query,a_query,cb) {
    mongoose.connection.db.collection(name, function(err, col) {
        if(err) {}
        col.findOneAndUpdate(f_query, {$set : a_query }, {upsert: true}, function(err, data) {
            if(err) {}
            else {
                return data;
            }
        })
    })
}



router.get('/data', authorize2(),async (req, res) => {
    try{
        find('users', `discord: { id: "${req.data.user}"}`, async function (err, data) {
            if(err){
                var query = { guild: process.env.GUILD_ID }
                find('accounts', query, function (err, data) {
                    if(err){
                        res.send({
                            status:400,
                            error:err,
                        })
                        return;
                    }
                    return res.json({
                        name:data[0].name,
                        serverImage:data[0].branding.logoUrl,
                        admin:false
                    })
                });
            }
            var admins = []
            for(var i =0; i < data.length; i++) admins.push(data[i].discord.id)
            if(admins.includes(req.data.user)) {
                
                try{
                    var query = { guild: process.env.GUILD_ID }
                    find('accounts', query, function (err, data) {
                        if(err){
                            res.send({
                                status:400,
                                error:err,
                            })
                            return;
                        }
                        return res.json({
                            name:data[0].name || 'null',
                            serverImage:data[0].branding.logoUrl,
                            admin:true
                        })
                    });
                }catch(e){
                    console.log(e)
                    return res.status(400).end()
                }

            }else {
                var query = { guild: process.env.GUILD_ID }
                find('accounts', query, function (err, data) {
                    if(err){
                        res.send({
                            status:400,
                            error:err,
                        })
                        return;
                    }
                    return res.json({
                        name:data[0].name,
                        serverImage:data[0].branding.logoUrl,
                        admin:false
                    })
                });
            }
        });
        
        
    }catch(e){
        var query = { guild: process.env.GUILD_ID }
        find('accounts', query, function (err, data) {
            if(err){
                res.send({
                    status:400,
                    error:err,
                })
                return;
            }
            return res.json({
                name:data[0].name,
                serverImage:data[0].branding.logoUrl,
                admin:false
            })
        });
    }
    
})


router.get('/user/:discordId', async (req, res) => {
    var query = "discord: { id: req.params.discordId.toString()}"
    find('users', query, function (err, data) {
        if(err){
            res.send({
                status:400,
                error:err,
            })
            return;
        }
        return res.send(data)
    });
})

router.get('/dashboard/:guildId',async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        // console.log(req.data.user)
        // check if user is admin/staff
        try{
            var query = { guild: req.params.guildId }
            find('accounts', query, function (err, data) {
                if(err){
                    res.send({
                        status:400,
                        error:err,
                    })
                    return;
                }
                return res.send(data)
            });
        }catch(e){
            console.log(e)
            return res.status(400).end()
        }
        
    } else {
        return res.status(403).end()
    }


})



// Add Dashboard User account to Database
router.post('/add/user', async (req, res) => {
    var body = req.body
    User.create({
        userName:`${body.username}#${body.discriminator}`,
        imageUrl:`https://cdn.discordapp.com/avatars/${body.id}/${body.avatar}.png`,
        email:body.email,
        id:uuidv4(),
        admin:false,
        staff:body.staff,
        lastLogin:Date.now(),
        discord:{
            accessToken:body.accessToken,
            avatar:body.avatar,
            discriminator:body.discriminator,
            id:body.id,
            refresh_token:body.refresh_token,
            username:body.username
        }
    }).then( (user) => {
        return res.status(200).json({message:"success"}).end()
    }).catch((error) => {
        console.log(error)
        return res.status(400).end()
    })
})
/////////////////////////////////////////



// Add Dashboard account to Database
router.post('/add/dashboard', async (req, res) => {
    var dashId = generateNoNumbers(25)
    Account.create({
        name:req.body.name,
        domain:req.body.domain,
        guild:req.body.guildId,
        ownerId:req.body.ownerID,
        stripeAccount:"empty",
        verificationStatus:"unverified",
        supportEmail:"support@example.com",
        id:dashId,
        settings:{
            payments:{
                failedPaymentOption:"1"
            }
        },
        staff:[],
        branding:{
            logoUrl:req.body.logoUrl,
            backgroundUrl:'',
            description:''
    
        }
    }).then( async  (dash) => {
        
        return res.status(200).json({message:"success"}).end()
    }).catch((error) => {
        console.log(error)
        return res.status(400).end()
    })
})
/////////////////////////////////////////




router.get('/dashboard/payment/:option', authorize(),async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        find('users', `discord: { id: "${req.data.user}"}`, async function (err, data) {
            if(err){
                return res.status(400).end()
            }
            var admins = []
            for(var i =0; i < data.length; i++) admins.push(data[i].discord.id)
            if(admins.includes(req.data.user)) {
                
                try{
        
                    var query = { settings: { payments: { failedPaymentOption: req.params.option } } }
                    update('accounts', { guild: process.env.GUILD_ID },query, function (err, data) {
                        if(err){
                            res.send({
                                status:400,
                                error:err,
                            })
                            return;
                        }
                        console.log(data)
                        return res.status(200).send(data)
                    });
                    
                
                }catch(e){
                    console.log(e)
                    return res.status(400).end()
                }

            }else {
                return res.status(400).end()
            }
        });


        
    } else {
        return res.status(403).end()
    }

})

router.get('/dashboard/supportEmail/:option', authorize(),async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        find('users', `discord: { id: "${req.data.user}"}`, async function (err, data) {
            if(err){
                return res.status(400).end()
            }
            var admins = []
            for(var i =0; i < data.length; i++) admins.push(data[i].discord.id)
            if(admins.includes(req.data.user)) {
                
                try{
        
                    var query = { supportEmail: atob(req.params.option) }
                    update('accounts', { guild: process.env.GUILD_ID }, query, function (err, data) {
                        if(err){
                            res.send({
                                status:400,
                                error:err,
                            })
                            return;
                        }
                        return res.status(200).send(data)
                    });
                    
                
                }catch(e){
                    console.log(e)
                    return res.status(400).end()
                }

            }else {
                return res.status(400).end()
            }
        });



    } else {
        return res.status(403).end()
    }

})
router.get('/dashboard/name/:option', authorize(),async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        find('users', `discord: { id: "${req.data.user}"}`, async function (err, data) {
            if(err){
                return res.status(400).end()
            }
            var admins = []
            for(var i =0; i < data.length; i++) admins.push(data[i].discord.id)
            if(admins.includes(req.data.user)) {
                
                try{
        
                    var query = { name: atob(req.params.option) }
                    update('accounts', { guild: process.env.GUILD_ID }, query, function (err, data) {
                        if(err){
                            console.log(err)
                            res.send({
                                status:400,
                                error:err,
                            })
                            return;
                        }
                        return res.status(200).send(data)
                    });
                    
                
                }catch(e){
                    console.log(e)
                    return res.status(400).end()
                }

            }else {
                return res.status(400).end()
            }
        });

        
    } else {
        return res.status(403).end()
    }

})
router.get('/dashboard/logo/:option', authorize(),async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {

        find('users', `discord: { id: "${req.data.user}"}`, async function (err, data) {
            if(err){
                return res.status(400).end()
            }
            var admins = []
            for(var i =0; i < data.length; i++) admins.push(data[i].discord.id)
            if(admins.includes(req.data.user)) {
                
                try{
        
                    var query = { branding:{ logoUrl: atob(req.params.option) } } 
                    update('accounts', { guild: process.env.GUILD_ID }, query, function (err, data) {
                        if(err){
                            res.send({
                                status:400,
                                error:err,
                            })
                            return;
                        }
                        return res.status(200).send(data)
                    });
                    
                
                }catch(e){
                    console.log(e)
                    return res.status(400).end()
                }

            }else {
                return res.status(400).end()
            }
        });


        
    } else {
        return res.status(403).end()
    }

})
router.get('/dashboard/background/:option', authorize(),async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {
        find('users', `discord: { id: "${req.data.user}"}`, async function (err, data) {
            if(err){
                return res.status(400).end()
            }
            var admins = []
            for(var i =0; i < data.length; i++) admins.push(data[i].discord.id)
            if(admins.includes(req.data.user)) {
                
                try{
        
                    var query = { backgroundUrl: atob(req.params.option) } 
                    update('accounts', { guild: process.env.GUILD_ID }, query, function (err, data) {
                        if(err){
                            res.send({
                                status:400,
                                error:err,
                            })
                            return;
                        }
                        return res.status(200).send(data)
                    });
                    
                
                }catch(e){
                    console.log(e)
                    return res.status(400).end()
                }

            }else {
                return res.status(400).end()
            }
        });


    
    } else {
        return res.status(403).end()
    }

})
router.get('/dashboard/description/:option', authorize(),async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {

        find('users', `discord: { id: "${req.data.user}"}`, async function (err, data) {
            if(err){
                return res.status(400).end()
            }
            var admins = []
            for(var i =0; i < data.length; i++) admins.push(data[i].discord.id)
            if(admins.includes(req.data.user)) {
                
                try{
        
                    var query = { description: atob(req.params.option) } 
                    update('accounts', { guild: process.env.GUILD_ID }, query, function (err, data) {
                        if(err){
                            res.send({
                                status:400,
                                error:err,
                            })
                            return;
                        }
                        return res.status(200).send(data)
                    });
                    
                
                }catch(e){
                    console.log(e)
                    return res.status(400).end()
                }

            }else {
                return res.status(400).end()
            }
        });


    
    } else {
        return res.status(403).end()
    }

})


router.get('/stats', authorize(),async (req, res) => {
    if(req.get('apikey') == process.env.API_KEY) {

        find('users', `discord: { id: "${req.data.user}"}`, async function (err, data) {
            if(err){
                return res.status(400).end()
            }
            var admins = []
            for(var i =0; i < data.length; i++) admins.push(data[i].discord.id)
            if(admins.includes(req.data.user)) {
                
                try{
        
                    var result = await pool.query(`SELECT * FROM users`)
                    var totalCustomers = result.rows.length
                    var customersMonth = 0
                    for(var i = 0; i<result.rows.length; i++) {
                        var date = new Date(result.rows[i].dateCreated * 1000)
                        var currentDate = new Date(Math.floor(Date.now()))
                        var month = ['January','February','March','April','May','June','July','August','September','October','November','December'][date.getMonth()]
                        var currentMonth = ['January','February','March','April','May','June','July','August','September','October','November','December'][currentDate.getMonth()]
                        if(month == currentMonth) {
                            customersMonth ++;
                        }
                    }
        
              
                    return res.status(200).json({
                        totalCustomers:totalCustomers,
                        customersMonth:customersMonth,
                        revenue:'$0'
                    })
                
                }catch(e){
                    console.log(e)
                    return res.status(400).end()
                }

            }else {
                return res.status(400).end()
            }
        });


        
    } else {
        return res.status(403).end()
    }

})

module.exports = router
