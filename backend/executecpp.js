const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");


const outputpath = path.join(__dirname, "outputs");

if(!fs.existsSync(outputpath)){
    fs.mkdirSync(outputpath, {recursive: true});
}

const executecpp = async (filepath)=>{
    const base = path.basename(filepath).split(".")[0];

    const newpath = path.join(outputpath, `${base}.out`);
    console.log(newpath)

    const p =  new Promise((res, rej)=>{  
        exec(`g++ ${filepath} -o ${newpath} && cd ${outputpath} && ${base}.out`, (error, stdout, stderr)=>{
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
    
    // return {}


}


module.exports = executecpp
