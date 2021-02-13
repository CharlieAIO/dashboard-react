const express = require('express');
const router = express.Router();
const {pool, generate} = require('../../utils.js')
const authorize = require('../../auth-middleware')
const { v4: uuidv4 } = require('uuid');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);
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
            if (req.query.name) results = await pool.query(`SELECT * FROM plans WHERE "planName" = '${req.query.name}'`)
            else results = await pool.query('SELECT * FROM plans')

            return res.status(200).json(results.rows)
        }catch(e){
            return res.status(400).end()
        }
    } else {
        return res.status(403).end()
    }

})

router.get('/get/:id',async (req, res) => {

    if(req.get('apikey') == process.env.API_KEY) {

        try{
            var results;
            if (req.params.id) results = await pool.query(`SELECT * FROM plans WHERE "planId" = '${req.params.id}'`)
            else results = await pool.query('SELECT * FROM plans')

            return res.status(200).json(results.rows)
        }catch(e){
            console.log(e)
            return res.status(400).end()
        }
    } else {
        return res.status(403).end()
    }

})


router.get('/data',authorize(), async (req, res) => {
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
            var results = await pool.query('SELECT * FROM plans')
            var data = []
            for(var i = 0; i <results.rows.length; i++)
            {
                data.push({label: results.rows[i].planName, value: results.rows[i].planId})
            }
            return res.status(200).json(data)
        }catch(e){
            return res.status(400).end()
        }

    } else {
        return res.status(403).end()
    }


})



// Add plan to Database
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
            try{
                var body = req.body
                var query = []
        
                const product = await stripe.products.create({
                    name: req.body.planName,
                });
        
                let price = req.body.price;
                if(price.includes('.')) price = price.replace('.','')
                else price += '00'
                

                // let price2 = req.body.oneTimeAmount;
                // if(price2.includes('.')) price2 = price2.replace('.','')
                // else price2 += '00'

                var createObject = {
                    unit_amount: parseInt(price),
                    currency: req.body.currency.toLowerCase(),
                    product: product.id
                }
                if(req.body.type == "recurring" || req.body.type == "recurring+onetime-payment") {
                    createObject.recurring = {
                        interval:req.body.intervalType || 'month',
                        interval_count:parseInt(req.body.interval) || 1
                    }
                }
        
                const plan = await stripe.prices.create(createObject);
        
                body['planId'] = plan.id
                body['id'] = uuidv4()
                body['oneTimeAmount'] = req.body.oneTimeAmount

                if(req.body.type != 'rental') body['expiry'] = 'none'
                else body['expiry'] = req.body.expiry
        
        
                for(var i in body)
                    query.push(body [i])
        
                
                
                await pool.query(
                    'INSERT INTO plans values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
                    query
                ) 
                return res.status(200).json({response:"added"})
        
            }catch(e){
                console.log(e)
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

// Delete a restock
router.get('/delete/:id', authorize(),async (req, res) => {

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
            await pool.query(
                `DELETE FROM plans WHERE "id" = '${req.params.id}'`
            ) 
            return res.status(200).end()
    
        }catch(e){
            return res.status(400).end()
        }

    } else {
        return res.status(403).end()
    }


})
/////////////////////////////////////////

module.exports = router
