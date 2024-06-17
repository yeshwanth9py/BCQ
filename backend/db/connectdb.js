const mongoose = require("mongoose");


const conndb = process.env.CONN_DB;

const connectdb = ()=>{
    mongoose.connect(conndb)
    .then(()=>{
        console.log("db connected successfully...");
    })
    .catch((err)=>{
        console.log(err);
        throw new Error("error connecting db");
    })
}

module.exports = connectdb;