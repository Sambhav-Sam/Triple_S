//requiring external pakages
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");




//requiring database dependencies
const User = require("./src/models/userauth");


const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());


//requiring internal dependencies
const isAuth = require("./routes/auth/isauth");
const userdetails = require("./routes/user/user");
const Auth = require("./routes/auth/auth");
const api = require("./src/api/api");
const UserDetail = require("./src/models/userDetails");
const findMatches = require("./src/middleware/retrievematches");

//-----------------------------------------
app.use("/auth", Auth);
app.use("/api", api);
app.use("/buildprofile", userdetails);


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
            const data = await UserDetail.findOne({ _id: user._id }).select({ moreDetail: { name: 1 } ,messages : 1});
            const name = data.moreDetail.name;
            const messages = data.messages.reverse();

            //fetching the match users name
            const matches = await findMatches(user._id);

            res.status(200).render("viewprofile/mainpage.ejs", { username: name, matches: matches ,messages : messages });
        }
        else {
            res.status(401).redirect("/auth/login");
        }
    }
    catch (err) {
        res.status(401).send(err);
    }
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

//port----------------------------------------------------
const PORT = 3000;
app.listen(PORT, (req, res) => {
    console.log(`server started on port:${PORT}`);
});