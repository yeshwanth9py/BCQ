const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const rateLimit = require('express-rate-limit');
const PORT = process.env.PORT || 3000;
const connectdb = require("./db/connectdb");
const userRouter = require("./routes/userRouter");
const cookieParser = require("cookie-parser");
const mcqRouter = require("./routes/mcqRoutes");
const roomRouter = require("./routes/roomRoute");
const gameStatsRouter = require("./routes/gameStatsRouter");
const profileRouter = require("./routes/profileRoutes");
const codeCombatRouter = require("./routes/codeCombatRouter");



connectdb();

// app.use(cors(
//     {
//         origin: "http://localhost:5173",
//         credentials: true
//     }
// ))

const allowedOrigins = [
    "http://localhost:5173",
    "https://bcq-1wuwjsyam-hello-048eb550.vercel.app"
];;

// CORS options with a function to dynamically set the origin
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            // Allow requests with no origin (e.g., mobile apps or curl requests)
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

// Use CORS middleware
app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser(
    {
        httpOnly: true,
        secure: true
    }
));



const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});



// currently commenting the rate limiter, dont even know why have i used it :(
// app.use('/api/', apiLimiter);


app.use("/app/user",userRouter);
app.use("/app/mcqs",mcqRouter);
app.use("/app/rooms", roomRouter);
app.use("/app/gamestats", gameStatsRouter);
app.use("/app/profile", profileRouter);

app.use("/app/codecombat", codeCombatRouter);



// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message
    });
});

app.listen(PORT, ()=>{
    console.log("server started listening to port", PORT);
});
