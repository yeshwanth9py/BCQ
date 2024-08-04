const express = require("express");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Otp = require('../db/Schemas/Otp');
const bcrypt = require('bcrypt');
const User = require('../db/Schemas/User'); // Assuming you have a User schema

const resetPasswordRouter = express.Router();

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    },
});

resetPasswordRouter.post("/reset-password", async (req, res) => {
    try {
        const { email } = req.body;
        const otp = crypto.randomInt(100000, 999999).toString();

        const newOtp = new Otp({
            email: email,
            otp: otp
        });
        await newOtp.save();

        const mailOptions = {
            from: 'CodeCombat <yeshwanthsai2008@gmail.com>',
            to: email,
            subject: "Your CodeCombat's OTP Code",
            text: `Hello, Your OTP code to reset your password is ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: 'Error sending OTP' });
            }
            console.log('Email sent: ' + info.response);
            res.json({ success: true });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message, success: false });
    }
});

resetPasswordRouter.post("/send-otp", async (req, res) => {
    try {
        console.log(req.body)
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please fill all the fields' });
        }

        const isvalidotp = await Otp.findOne({ email: email, otp: otp });

        if (!isvalidotp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // Hash and save the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ email }, { password: hashedPassword });

        // Remove the OTP from the database after successful password reset
        await Otp.deleteOne({ email: email, otp: otp });

        res.json({ success: true, message: 'Password reset successfully' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message, success: false });
    }
});

module.exports = resetPasswordRouter;
