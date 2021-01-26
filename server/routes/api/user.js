const express = require('express');
const router = express.Router();
const {pool, generate} = require('../../utils.js')
const authorize = require('../../auth-middleware')

router.get('/', async (req, res) => {
    try{
        var results;
        if (req.query.id) results = await pool.query(`SELECT * FROM users WHERE "discordId" = ${req.query.id}`)
        else results = await pool.query('SELECT * FROM users')

        return res.status(200).json(results.rows)
    }catch(e){
        return res.status(400).end()
    }

})


// Add User to Database
router.post('/add', async (req, res) => {
    try{
        var query = []
        for(var i in req.body)
            query.push(req.body [i])
        
            query[10] = Date.now()  //Date Created
            query[11] = "" //Date Joine
        await pool.query(
            'INSERT INTO users values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
            query
        ) 
        return res.status(200).json({response:"added"})

    }catch(e){
        return res.status(400).end()
    }

})
/////////////////////////////////////////

module.exports = router
