const express = require("express");
const Codingqs = require("../db/Schemas/Codingqs");



const codeCombatRouter = express.Router();
const generatefile = require("../generatefile");
const executecpp = require("../executecpp");
const executepy = require("../executepy");
const Job = require("../db/Schemas/Job");

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
    let job;
    try{
        const { code, lang="cpp", question } = req.body;

        if(!code || !question) {
            return res.status(400).send({ message: "All required fields must be provided" });
        }
        // i dont know what to do here
        const filepath = await generatefile(lang, code);
        console.log(filepath)
        job = new Job({lang, filepath});
        
        job = await job.save();
        const jobid = job["_id"];
        res.status(201).json({success: true, jobid});

        let output;
        console.log("job",job);

        job["startedAt"] = new Date();
        
        if(lang == "cpp"){
            // if lang is cpp then generate a cpp output file, then run that file and then send the respone
            output = await executecpp(filepath);
        } else if(lang == "py"){
            output = await executepy(filepath);
        }
        job["completedAt"] = new Date();
        job["status"] = "completed";
        job["output"] = output;

        await job.save();
        
        console.log({filepath, output});
        console.log(job);

    } catch(error){
        job["completedAt"] = new Date();
        job["status"] = "failed";
        job["output"] = JSON.stringify(error);
        await job.save();
        console.log(job);
        console.error(error);
        // return res.json(error);
    }
  
});

codeCombatRouter.get("/status", async (req, res) => {
    try {
        const jobid = req.query.id;
        if(jobid == undefined){
            return res.status(400).json({success: false, error:"missing id query param"})
        }
        const job = await Job.findById(jobid);
        if(job == "undefined"){
            return res.status(404).json({success: false, error:"invalid job id"});
        }
        return res.status(200).json({success:true, job});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = codeCombatRouter;