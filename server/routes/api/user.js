const express = require('express');
const router = express.Router();
const {pool, generate} = require('../../utils.js')
const authorize = require('../../auth-middleware')
const { v4: uuidv4 } = require('uuid');

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
        query[0] = generate(30)
        for(var i in req.body)
            query.push(req.body [i])
        
            query[10] = Date.now()  //Date Created
            query[11] = 0 //Date Joined
            query[12] = uuidv4()

        console.log(query)
        await pool.query(
            'INSERT INTO users values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',
            query
        ) 
        return res.status(200).json({response:"added"})

    }catch(e){
        return res.status(400).end()
    }

})
/////////////////////////////////////////

// Add User to Database
router.post('/bind', async (req, res) => {
    try{
        var result = await pool.query(`SELECT * FROM users WHERE "key" = ${req.body.key}`).rows[0]
        await pool.query(
            'UPDATE users SET discordId = $1, discordName =  $2, discordImage = $3, email = $4, dateJoined = $5 WHERE key = $6 ',
            [req.body.discordId, req.body.discordName, req.body.discordImage, req.body.email, Date.now(), req.body.key]
        ) 
        return res.status(200).json({response:"bound"})

    }catch(e){
        return res.status(400).end()
    }

})
/////////////////////////////////////////

module.exports = router
