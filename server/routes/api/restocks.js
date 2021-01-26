const express = require('express');
const router = express.Router();
const {pool} = require('../../utils')

router.get('/', async (req, res) => {
    try{
        var results;
        if(req.query.password) results = await pool.query(`SELECT * FROM restocks WHERE "password" = '${req.query.password}'`)
        else results = await pool.query('SELECT * FROM restocks')
        
        return res.status(200).json(results.rows)
    }catch(e){
        return res.status(400).end()
    }
})



// Add Restock to Database
router.post('/add', async (req, res) => {
    if(req.get('authorization') == process.env.API_KEY) 
    {
        try{
            var query = []
            for(var i in req.body)
                query.push(req.body [i])

            await pool.query(
                'INSERT INTO restocks values ($1,$2,$3,$4,$5,$6)',
                query
            ) 

            return res.status(200).json({response:"added"})
            

        }catch(e){
            // console.log(e)
            return res.status(400).end()
            
        }
    }

    else
    {
        return res.status(403).end()
    }
})
/////////////////////////////////////////


// Retrieve a restock
router.get('/get/:password', async (req, res) => {
    if(req.get('authorization') == process.env.API_KEY) 
    {
        try{
            var response = await pool.query(
                `SELECT * FROM restocks WHERE "password" = '${req.params.password}'`
            ) 
            return res.status(200).json(response.rows[0])

        }catch(e){
            return res.status(400).end()
        }
    }

    else
    {
        return res.status(403).end()
    }
})
/////////////////////////////////////////


// Delete a restock
router.get('/delete/:id', async (req, res) => {
    if(req.get('authorization') == process.env.API_KEY) 
    {
        try{
            await pool.query(
                `DELETE FROM restocks WHERE "id" = '${req.params.id}'`
            ) 
            return res.status(200).end()

        }catch(e){
            return res.status(400).end()
        }
    }

    else
    {
        return res.status(403).end()
    }
})
/////////////////////////////////////////


// Deduct Stock
router.get('/deduct/:id', async (req, res) => {
    if(req.get('authorization') == process.env.API_KEY) 
    {
        try{
            var restock = await pool.query(`SELECT * FROM restocks WHERE "id" = '${req.params.id}'`)
            var stock = parseInt(restock.rows[0].stockRemaining) - 1;
            await pool.query(
                `UPDATE restocks SET "stockRemaining" = ${stock} WHERE "id" = '${req.params.id}'`
            ) 
            return res.status(200).end()

        }catch(e){
            console.log(e)
            return res.status(400).end()
        }
    }

    else
    {
        return res.status(403).end()
    }
})
/////////////////////////////////////////


module.exports = router
