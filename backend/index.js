const express = require("express");
const app = express();
require("dotenv").config();


const PORT = process.env.PORT || 3000;
const connectdb = require("./db/connectdb");
const userRouter = require("./routes/userRouter");
const cookieParser = require("cookie-parser");

app.use(express.json());

app.use(cookieParser());

connectdb();



app.use("/app/user",userRouter);


app.use((req, res, err)=>{
    res.status(500).json(err);
});

app.listen(PORT, ()=>{
    console.log("server started listening to port", PORT);
});
