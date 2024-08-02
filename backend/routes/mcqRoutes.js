const express = require("express");
const MCQ = require("../db/Schemas/Mcq");
const auth = require("../authenticate");
const mcqRouter = express.Router();



// const 


mcqRouter.get("/all", async (req, res)=>{
    try{
        const allmcqs = await MCQ.find({});
        return res.json({
            mcqs:allmcqs
        });
    } catch(err){
        console.error(err);
        return res.status(400).json(err);
    }
});

mcqRouter.get("/getrandom", async (req, res)=>{

    const randommcq = await MCQ.aggregate([{$sample:{size:1}}]);
    if(randommcq.length>0){
        const {_id, question, options} = randommcq[0]
        res.json({id:_id, question, options});
    } else{
        res.status(404).json({message: "no docs found"});
    } 
})

mcqRouter.post("/checkans", async (req, res)=>{
    console.log(req.body)
    //error checking with id
    // let resp = await MCQ.findById(req.body.id);
    // console.log("resp", resp)
    // if(!resp){
    //     console.log("not found", req.body.id)
    //     resp = await MCQ.findOne({_id: `${req.body.id}`});
    // }

    const resp = await MCQ.findOne({question:req.body.question});
    console.log(resp);  
    if(resp.correctAnswer === req.body.ans){

        res.json({correct: true, explanation: resp.explanation});
    } else{
        res.json({correct: false, explanation: resp.explanation});
    }
});

mcqRouter.post("/", /*auth, */ async (req, res)=>{

    try{
        const mcqs = await MCQ.create(req.body);
        res.json({
            msg: "mcqs have been added successfully"
        })
    }catch(err) {
        res.status(400).json(err);
    }
});

// mcqRouter.post("/check/:")


mcqRouter.put("/:id",  async (req, res)=>{
    const { id } = req.params;
    const { question, options, correctAnswer, explanation, category, difficulty } = req.body;

    if(!question || !options || !correctAnswer || !category || !difficulty) {
        return res.status(400).send({ message: "All required fields must be provided" });
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        return res.status(400).send({ message: "Invalid difficulty level" });
    }

    try{
        const updatedMCQ = await MCQ.findByIdAndUpdate(
            id,
            { question, options, correctAnswer, explanation, category, difficulty },
            { new: true, runValidators: true }
        );

        if (!updatedMCQ) {
            return res.status(404).send({ message: "MCQ not found" });
        }
        res.send(updatedMCQ);
    } catch(err){
        console.error(error);
        res.status(404).send({ message: "An error occurred while updating the MCQ" });
    }

})

module.exports = mcqRouter;
