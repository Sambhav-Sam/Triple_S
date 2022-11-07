//requiring external pakages
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");




//requiring database dependencies
const User = require("./src/models/userauth");

//requiring internal dependencies
const createToken = require("./routes/auth/createtoken");
const isAuth = require("./routes/auth/isauth");
const createUser = require("./src/middleware/authentication/createuser");
const findUser = require("./src/middleware/authentication/finduser");
const userdetails = require("./routes/user/user");
const Auth = require("./routes/auth/auth");
const api = require("./src/api/api");
const UserDetail = require("./src/models/userDetails");


const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

//-----------------------------------------
app.use("/auth", Auth);
app.use("/api",api);
app.use("/buildprofile",userdetails);


//routes--------------------------------------------------

app.get("/test", async (req, res) => {
    try {
        const user = await isAuth(req);
        if (user) {
            res.status(200).render("login_registeration/info.ejs");
        }
        else {
            res.status(401).send("bad request");
        }
    }
    catch (err) {
        res.status(401).send(err);
    }
});

app.get("/test2", async (req, res) => {
    try {
        const user = await isAuth(req);
        if (user) {
            const data = await UserDetail.findOne({_id: user._id}).select({moreDetail : {name : 1}});
            const name = data.moreDetail.name;
            res.status(200).render("viewprofile/mainpage.ejs",{username : name});
        }
        else {
            res.status(401).send("bad request");
        }
    }
    catch (err) {
        res.status(401).send(err);
    }
});

app.get("/login", (req, res) => {
    res.render("login_registeration/login.ejs");
});

app.get("/working", async (req, res) => {
    try {
        const user = await isAuth(req);
        if (user) {
            res.status(200).send(user);
        }
        else {
            res.status(401).send("bad request");
        }
    }
    catch (err) {
        res.status(401).send(err);
    }
});

app.post("/register", async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        if (password === confirmPassword) {
            const user = await createUser(username, email, password);
            const token = await createToken(user._id);
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 6000000),
                httpOnly: true
            });
            res.redirect("/auth/verifyemail");
        }
        else {
            console.log("password didn't matched");
            res.send("password didn't matched");
        }

    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await findUser(email, password, res);
        if (result.status) {
            res.status(result.statuscode).redirect("/working");
        }
        else {
            res.status(result.statuscode).redirect("/login");
        }


    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }

});

//port----------------------------------------------------
const PORT = 3000;
app.listen(PORT, (req, res) => {
    console.log(`server started on port:${PORT}`);
});