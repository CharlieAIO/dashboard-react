const jwt = require('jsonwebtoken');

module.exports = () => {
    return(req, res, next) => {

        const token = req.headers['x-access-token'].slice(7)
        if(!token) {
            return res.status(403).send("unauthorized")
        } else {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if(err) return res.status(403).send("unauthorized")

                else {
                    req.data = decoded
                    next()
                }
            })
        }
    }
}