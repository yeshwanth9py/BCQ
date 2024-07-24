const jwt = require("jsonwebtoken");


const auth = (req, res, next)=>{
    try{
        const token = req.cookies.token || req.headers["auth-token"];
        console.log("token:- ",token)
        if(!token){
            return res.status(400).json({
                msg: "user is not authenticated",
                success: false
            });
        }

        const payload = jwt.verify(token, "SECRETKEY");

        // need to validate the profile

        req.userd = payload;
        next();

    } catch(err){
        return res.status(400).json({
            msg: "user is not authenticated",
            error: err,
            success: false
        })
    } 
}


module.exports = auth;