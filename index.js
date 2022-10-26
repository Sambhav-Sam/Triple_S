//requiring external pakages
require("dotenv").config();
const express = require("express");

//requiring internal dependencies
require("./src/db/connection");

const app = express();
app.use(express.static("public"));
app.set("view engine","ejs");


app.get("/login",(req,res)=>{
    res.render("login_registeration/login.ejs");
});


//port
const PORT = 3000;
app.listen(PORT,(req,res)=>{
    console.log(`server started on port:${PORT}`);
});