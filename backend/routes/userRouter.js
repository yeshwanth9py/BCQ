const express = require("express");
const userRouter = express.Router();
const { z } = require('zod');
const User = require("../db/Schemas/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const auth = require("../authenticate");


const userSchema = z.object({
    username: z.string().nonempty("Username is required").regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric and can include underscores"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    email: z.string().email("Invalid email address"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long").optional(),
    profilePic: z.string().optional()
});

userRouter.post("/signup", async (req, res)=>{
    console.log("coming")
    const result = userSchema.safeParse(req.body);
    console.log(result.error)
    if(!result.success){
        return res.status(400).json(result.error);
    }
    try{
        const {username, password, email} = req.body;

        const salt = await bcrypt.genSalt(10);
        let newpassword = await bcrypt.hash(password, salt);

        const udetails = await User.create({
            username,
            password: newpassword,
            email,
            profilePic: req.body.profilePic
        });
        res.json({uid: udetails._id});
    } catch(err){
        res.status(400).json({
            msg: "some error signing up"
        });
    }
});


userRouter.post("/login", async (req, res)=>{
    const result = userSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json(result.error);
    }
    try{
        const {username, password, email} = req.body;
        const udetails = await User.findOne({username});
        if (!udetails) {
            return res.status(400).json({ message: 'Invalid username' });
        }
        const savedpassword = udetails.password;
        const isMatch = await bcrypt.compare(password, savedpassword);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({username, email}, "SECRETKEY", {
            expiresIn: '1h',
        });

        res.cookie('token', token, {
            httpOnly: true, 
            secure: false, // true if your app is hosted on HTTPS
            sameSite: 'Lax', // true if your site uses
            maxAge: 3600000, // 1 hour in milliseconds
        });

        res.json({uid: udetails._id, username: udetails.username, profilePic: udetails.profilePic});

    } catch(err){
        res.status(400).json({
            msg: "some error logging in"
        });
    }
})


userRouter.get("/users", auth, (req, res)=>{
    return res.json({
        "mama": "miya"
    });
});

module.exports = userRouter;