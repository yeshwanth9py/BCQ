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


userRouter.get("/", /*auth*/ async (req, res)=>{
    try{
        const userd = await Profile.findById({profile: req.userd.profile});
        res.json(userd);
    } catch(err){
        console.error(err);
        return res.status(400).json(err);
    }
});

userRouter.post("/signup", async (req, res)=>{
    console.log(req.body);
    const result = userSchema.safeParse(req.body);
    console.log(result.error)
    if(!result.success){
        return res.status(400).json(result.error);
    }
    try{
        console.log("coming")
        const {username, password, email, profilePic} = req.body;

        const salt = await bcrypt.genSalt(10);

        let newpassword = await bcrypt.hash(password, salt);

        const pdetails = await Profile.create({
            username,
            profilePic: profilePic,
            bio:"",
            followers:[],
            following: [],
            likes: [],
            rank: "Noob",
            email: email,
            previousGames: [],
            notifications: [],
        });

        console.log("profile", pdetails);

        const udetails = await User.create({
            username,
            password: newpassword,
            email,
            profilePic: req.body.profilePic,
            profile: pdetails._id,
        })

        console.log("udetails", udetails);

        const token = jwt.sign({username, email}, "SECRETKEY", {
            expiresIn: '1h',
        });
        
        res.cookie('token', token, {
            httpOnly: true,
            // sameSite: 'none',
            secure: false  // Set to true in production for HTTPS
        });

        res.json({uid: udetails._id, username: udetails.username, pid: pdetails._id, profilepic: udetails.profilepic});
    } catch(err){
        res.status(400).json({
            msg: "some error signing up"
        });
    }
});




userRouter.post("/login", async (req, res)=>{
    const result = userSchema.safeParse(req.body);
    console.log("result", result);
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

        const token = jwt.sign({_id: udetails._id, username, email}, "SECRETKEY", {
            expiresIn: '6h',
        });

        console.log("token", token)
        

        res.cookie('token', token, {
            httpOnly: false, 
            secure: false, // true if your app is hosted on HTTPS
            sameSite: 'lax', // true if your site uses
            maxAge: 36000000, // 1 hour in milliseconds
        });
        console.log(udetails)
        
        res.json({uid: udetails._id, username: udetails.username, profilePic: udetails.profilepic, pid: udetails.profile});

    } catch(err){
        console.log(err)
        res.status(400).json({
            msg: "some error logging in"
        });
    }
})

userRouter.get("/profile/:id", async (req, res)=>{
    try{
        const profile = await Profile.find({ username: req.params.id });
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

userRouter.get("/isLoggedIn", auth, (req, res)=>{
    console.log("authorized req")
    return res.json({
        "mama": "miya",
        success: true
    });
});


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
