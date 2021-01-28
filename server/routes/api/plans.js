const express = require('express');
const router = express.Router();
const {pool, generate} = require('../../utils.js')
const authorize = require('../../auth-middleware')
const { v4: uuidv4 } = require('uuid');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);


router.get('/', async (req, res) => {
    try{
        var results;
        if (req.query.name) results = await pool.query(`SELECT * FROM plans WHERE "planName" = ${req.query.name}`)
        else results = await pool.query('SELECT * FROM plans')

        return res.status(200).json(results.rows)
    }catch(e){
        return res.status(400).end()
    }

})

router.get('/data', async (req, res) => {
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
})



// Add plan to Database
router.post('/add', async (req, res) => {
    try{
        var body = req.body
        var query = []

        const product = await stripe.products.create({
            name: req.body.planName,
        });

        let price = req.body.price;
        if(price.includes('.')) price = price.replace('.','')
        else price += '00'

        const plan = await stripe.plans.create({
            amount: parseInt(price),
            currency: req.body.currency.toLowerCase(),
            interval: req.body.intervalType,
            interval_count:parseInt(req.body.interval),
            product: product.id,
        });

        body['planId'] = plan.id
        body['id'] = uuidv4()


        for(var i in body)
            query.push(body [i])

        
        
        await pool.query(
            'INSERT INTO plans values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
            query
        ) 
        return res.status(200).json({response:"added"})

    }catch(e){
        console.log(e)
        return res.status(400).end()
    }

})
/////////////////////////////////////////

// Delete a restock
router.get('/delete/:id', async (req, res) => {

    try{
        await pool.query(
            `DELETE FROM plans WHERE "id" = '${req.params.id}'`
        ) 
        return res.status(200).end()

    }catch(e){
        return res.status(400).end()
    }

})
/////////////////////////////////////////

module.exports = router
