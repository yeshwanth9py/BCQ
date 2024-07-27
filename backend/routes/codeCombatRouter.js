const express = require("express");
const Codingqs = require("../db/Schemas/Codingqs");



const codeCombatRouter = express.Router();
const generatefile = require("../generatefile");
const executecpp = require("../executecpp");
const executepy = require("../executepy");
const Job = require("../db/Schemas/Job");

codeCombatRouter.get("/getrandom", async (req, res) => {
    const randomcq = await Codingqs.aggregate([{ $sample: { size: 1 } }]);
    if (randomcq.length > 0) {
        const { _id, question, testcase1, testcase2, testcase3, testcase4, testcase5, tags, difficulty, pystubFile, cppstubFile, jsstubFile, cppfunctioncall, jsfunctioncall, pyfunctioncall } = randomcq[0]
        res.json({ id: _id, question, testcase1, testcase2, testcase3, testcase4, testcase5, tags, difficulty, pystubFile, cppstubFile, jsstubFile, cppfunctioncall, jsfunctioncall, pyfunctioncall });
    } else {
        res.status(404).json({ message: "no docs found" });
    }
})


codeCombatRouter.post("/create", async (req, res) => {
    const { question, testcase1, testcase2, testcase3, testcase4, testcase5, tags, difficulty, pystubFile, cppstubFile, jsstubFile } = req.body;
    console.log("abot to create")
    const cq = new Codingqs({
        question: question,
        testcase1: testcase1,
        testcase2: testcase2,
        testcase3: testcase3,
        testcase4: testcase4,
        testcase5: testcase5,
        tags: tags,
        difficulty,
        pystubFile,
        cppstubFile,
        jsstubFile
    });

    try {
        await cq.save();
        return res.json({ message: "CQ created successfully", cq });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Error creating CQ" });
    }
});




codeCombatRouter.post("/submit", async (req, res) => {
    let job;
    try {
        const { code, lang = "cpp", question } = req.body;

        if (!code || !question) {
            return res.status(400).send({ message: "All required fields must be provided" });
        }
        // i dont know what to do here
        const filepath = await generatefile(lang, code);
        console.log(filepath)
        job = new Job({ lang, filepath });

        job = await job.save();
        const jobid = job["_id"];
        res.status(201).json({ success: true, jobid });

        let output;
        console.log("job", job);

        job["startedAt"] = new Date();

        if (lang == "cpp") {
            // if lang is cpp then generate a cpp output file, then run that file and then send the respone
            output = await executecpp(filepath);
        } else if (lang == "py") {
            output = await executepy(filepath);
        }
        job["completedAt"] = new Date();
        job["status"] = "completed";
        job["output"] = output;

        await job.save();

        console.log({ filepath, output });
        console.log(job);

    } catch (error) {
        job["completedAt"] = new Date();
        job["status"] = "failed";
        job["output"] = JSON.stringify(error);
        await job.save();
        console.log(job);
        console.error(error);
        // return res.json(error);
    }

});


codeCombatRouter.post("/submit/:qid", async (req, res) => {
    try {
        const { code, lang = "cpp", question, functioncall } = req.body;
        const qid = req.params.qid;

        if (!code || !question) {
            return res.status(400).send({ message: "All required fields must be provided" });
        }

        const testcases = await Codingqs.findById(qid).select("testcase1 testcase2 testcase3 testcase4 testcase5");
        if (!testcases) {
            return res.status(404).send({ message: "Test cases not found" });
        }

        let tempcode = code;
        let tempcall = functioncall;
        // let jobids = [];

        if (lang == "py") {
            for (let i = 1; i <= 5; i++) {
                const op = testcases[`testcase${i}`];
                if (!op) continue;

                const { input, output } = op;
                tempcall = tempcall.replace("###", input);
                tempcode += `\n${tempcall}`;

                tempcall = functioncall;
                // tempcode = code;
            }
        }

        if (lang == "cpp") {
            for (let i = 1; i <= 5; i++) {
                const op = testcases[`testcase${i}`];
                if (!op) continue;

                const { input, output } = op;
                tempcall = tempcall.replace("###", input);
                tempcode += `\n${tempcall}`;

                tempcall = functioncall;
                // tempcode = code;
            }
            tempcode += "}"
        }

        const filepath = await generatefile(lang, tempcode);
        let job = new Job({ lang, filepath, qid });
        job = await job.save();
        // jobids.push(job["_id"]);

        res.status(201).json({ success: true, job });


        let output;

        let jobres = await Job.findById(job["_id"]);


        jobres.startedAt = new Date();
        if (lang === "cpp") {
            output = await executecpp(jobres.filepath);
        } else if (lang === "py") {
            output = await executepy(jobres.filepath);
        }

        jobres.completedAt = new Date();
        jobres.status = "completed";
        jobres.output = [];
        output = output.split("\r\n");


        for (let i = 1; i <= 5; i++) {

            jobres.output.push({
                output: output[i - 1],
                input: testcases[`testcase${i}`].input,
                expected: testcases[`testcase${i}`].output,
                passed: output[i - 1] == testcases[`testcase${i}`].output
            })
        }


        await jobres.save();


    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error", error });
    }
});


codeCombatRouter.post("/status", async (req, res) => {
    try {
        const pjob = req.body.job || req.query.job;

        const job = await Job.findById(pjob["_id"]);
        if (!job) {
            return res.status(404).json({ success: false, error: "Job not found", completed: false });
        }

        if (job.status === "completed") {
            return res.status(200).json({ success: true, job, completed: true });
        } else {
            return res.status(200).json({ success: true, job, completed: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message, success: false, completed: false });
    }
});



module.exports = codeCombatRouter;