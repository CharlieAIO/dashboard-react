const jwt = require('jsonwebtoken');

module.exports = () => {
    return(req, res, next) => {
        if(req.headers['user-agent'] == 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)') {}
        else return res.status(403).send("unauthorized")

        
        var token
        try{
            token = req.headers['authorization'].slice(7)
        }catch{
            return res.status(403).send("unauthorized")
        }
        if(!token) {
            return res.status(403).send("unauthorized")
        } else {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if(err) {
                    console.log(err)
                    return res.status(403).send("unauthorized")
                }

                else {
                    req.data = decoded
                    next()
                    
                }
            })
        }
    }
}