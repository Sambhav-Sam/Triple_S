//requiring external pakages
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");


const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(cookieSession({
    maxAge :24*60*60*1000,
    keys : ['sambhavsarthaksambhav']
}));

//initialize
app.use(passport.initialize());
app.use(passport.session());


//requiring internal dependencies
const userdetails = require("./routes/user/user");
const viewprofile = require("./routes/viewprofiles");
const Auth = require("./routes/auth/auth");
const api = require("./src/api/api");
const sos = require("./routes/sos/sos");

//-----------------------------------------
app.use("/auth", Auth);
app.use("/api", api);
app.use("/buildprofile", userdetails);
app.use("/sos",sos);
app.use("/",viewprofile);


//routes--------------------------------------------------

app.get("/",async (req,res)=>{
    try{
        res.status(200).render("homepage/home.ejs");
    }
    catch(err)
    {
        console.log(err);
    }
});


app.get("*",async (req,res)=>{
    res.status(404).render("error404/error.ejs");
});

//port----------------------------------------------------
const PORT = 3000;
app.listen(PORT, (req, res) => {
    console.log(`server started on port:${PORT}`);
});