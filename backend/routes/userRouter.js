const express = require("express");
const userRouter = express.Router();
const { z } = require('zod');
const User = require("../db/Schemas/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const auth = require("../authenticate");
const  Profile  = require("../db/Schemas/Profile");


const userSchema = z.object({
    username: z.string().nonempty("Username is required").regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric and can include underscores"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    email: z.string().email("Invalid email address"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long").optional(),
    profilePic: z.string().optional()
});


userRouter.get("/", auth, async (req, res)=>{
    try{
        const userd = await Profile.findById({profile: req.userd.profile});
        res.json(userd);
    } catch(err){
        console.error(err);
        return res.status(400).json(err);
    }
});

userRouter.post("/signup", async (req, res)=>{
    console.log("coming")
    console.log(req.body);
    const result = userSchema.safeParse(req.body);
    console.log(result.error)
    if(!result.success){
        return res.status(400).json(result.error);
    }
    try{
        const {username, password, email} = req.body;

        const salt = await bcrypt.genSalt(10);
        let newpassword = await bcrypt.hash(password, salt);

        const pdetails = await Profile.create({
            username,
            profilePic: req.body.profilePic,
            bio:"",
            followers:[],
            following: [],
            likes: [],
            rank: "Noob",
            email: email,
            previousGames: [],
        });

        const udetails = await User.create({
            username,
            password: newpassword,
            email,
            profilePic: req.body.profilePic,
            profile: pdetails._id
        });

        const token = jwt.sign({username, email}, "SECRETKEY", {
            expiresIn: '1h',
        });
        
        res.cookie('token', token, {
            httpOnly: true,
            // sameSite: 'none',
            secure: false  // Set to true in production for HTTPS
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
    console.log(req.body);
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
            sameSite: 'lax', // true if your site uses
            maxAge: 3600000, // 1 hour in milliseconds
        });

        res.json({uid: udetails._id, username: udetails.username, profilePic: udetails.profilePic, token: token});

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


userRouter.delete("/delete", auth, async (req, res)=>{
    try{
        const userd = await User.findByIdAndDelete(req.userd._id);
        const profiled = await Profile.findByIdAndDelete({profile: userd._id});
        res.json({msg: "deleted successfully"});
    } catch(err){
        console.error(err);
        return res.status(400).json(err);
    }
});

module.exports = userRouter;