const jwt = require("jsonwebtoken");


const auth = (req, res, next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({
                msg: "user is not authenticated"
            })
        }

        const payload = jwt.verify(token, "SECRETKEY");

        req.userd = payload;
        next();

    } catch(err){
        return res.status(400).json({
            msg: "user is not authenticated"
        })
    } 
}


module.exports = auth;