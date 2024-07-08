const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");


const outputpath = path.join(__dirname, "outputs");

if(!fs.existsSync(outputpath)){
    fs.mkdirSync(outputpath, {recursive: true});
}

const executepy = async (filepath)=>{

    const p =  new Promise((res, rej)=>{  
        exec(`python ${filepath}`, (error, stdout, stderr)=>{
            if(error){
                console.log("error",error)
                rej({error, stderr});
            }
            if(stderr){
                console.log("stderr",stderr)
                rej(stderr);
            }
            res(stdout);
        });

    });
    p.catch((err)=>{
        console.log(err);
    })
    return p;
    


}


module.exports = executepy