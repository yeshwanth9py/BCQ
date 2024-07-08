const fs = require("fs");
const path = require("path");
const {v4:uuid} = require("uuid");

const codepath = path.join(__dirname, "codes");

if(!fs.existsSync(codepath)){
    fs.mkdirSync(codepath, {recursive: true}); 
}

const generatefile = async (format, code)=>{
    const name = uuid();
    const newpath = path.join(codepath, `${name}.${format}`);

    await fs.writeFileSync(newpath, code);

    return newpath;
}


module.exports = generatefile