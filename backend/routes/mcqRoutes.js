const express = require("express");
const MCQ = require("../db/Schemas/Mcq");
const auth = require("../authenticate");
const mcqRouter = express.Router();


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

mcqRouter.post("/", auth, async (req, res)=>{

    try{
        const mcqs = await MCQ.create(req.body);
        res.json({
            msg: "mcqs have been added successfully"
        })
    } catch(err) {
        res.status(400).json(err);
    }
});



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

