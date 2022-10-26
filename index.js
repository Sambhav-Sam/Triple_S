//requiring external pakages
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");


//requiring database dependencies
const User = require("./src/models/userauth");

//requiring internal dependencies
const createToken = require("./routes/auth/createtoken");
const isAuth = require("./routes/auth/isauth");
const Auth = require("./routes/auth/login");


const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());


//-----------------------------------------
app.use("/auth",Auth);


app.use(session({
    secret: process.env.SECRET2,
    resave: false,
    saveUninitialized: false
}));

// app.use(passport.authenticate('session'));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//routes--------------------------------------------------
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
            const user = await User.register({ username: username, email: email }, password);
            const token = await createToken(user._id, user);
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true
            });
            res.redirect("/working");
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
        const{email,password}=req.body;

        const user = new User({
            username : "j",
            email : email,
            password : password
        });

        req.login(user,function(err){
            if(err){
                console.log(err)
            }else{
                console.log("user found");
            }
        });

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