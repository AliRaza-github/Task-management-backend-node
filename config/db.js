const mongoose  = require("mongoose");

const ConnectDb   = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || "");
        console.log("DB connected successfully. ");
        
    } catch (error) {
        console.log("DB connection error");
        return res(json({message:"DB is not connected"}));
        
    }
}

module.exports = ConnectDb;