const mongoose = require("mongoose");

require("dotenv").config();

const DBConnection = ()=>{
 mongoose.connect(process.env.MONGOSE_URL)
 .then( ()=>{
    console.log("Database Connected");
})
.catch((err)=>{
    console.log(err);
    process.exit(1)
})
}

module.exports=DBConnection;