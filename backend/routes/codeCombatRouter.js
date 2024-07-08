const express = require("express");
const Codingqs = require("../db/Schemas/Codingqs");



const codeCombatRouter = express.Router();
const generatefile = require("../generatefile");
const executecpp = require("../executecpp");

codeCombatRouter.get("/getrandom", async (req, res) => {
    const randomcq = await Codingqs.aggregate([{$sample:{size:1}}]);
    if(randomcq.length>0){
        const {_id, question, testcase1, testcase2, testcase3, testcase4, testcase5} = randommcq[0]
        res.json({id:_id, question, testcase1, testcase2, testcase3, testcase4, testcase5});
    } else{
        res.status(404).json({message: "no docs found"});
    } 
})


codeCombatRouter.post("/create", async (req, res) => {
    const {question, testcase1, testcase2, testcase3, testcase4, testcase5} = req.body;
    const cq = new Codingqs({
        question: question,
        testcase1: testcase1,
        testcase2: testcase2,
        testcase3: testcase3,
        testcase4: testcase4,
        testcase5: testcase5
    });
    try {
        await cq.save();
        return res.json({ message: "CQ created successfully", cq });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Error creating CQ" });
    }
});


codeCombatRouter.post("/submit", async (req, res)=>{
    try{
        const { code, lang="cpp", question } = req.body;

        if(!code || !question) {
            return res.status(400).send({ message: "All required fields must be provided" });
        }
        // i dont know what to do here
        
        // if lang is cpp then generate a cpp output file, then run that file and then send the respone
        const filepath = await generatefile("cpp", code);
        console.log(filepath)
        
        const output = await executecpp(filepath);
        return res.json({filepath, output});
    } catch(err){
        console.error(err);
        return res.status(400).json({ message: "Error executing CQ" });
    }


    

    
});


module.exports = codeCombatRouter;