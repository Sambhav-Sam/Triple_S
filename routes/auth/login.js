const express = require("express");
const createUser = require("../../src/middleware/authentication/createuser");
const findUser = require("../../src/middleware/authentication/finduser");
const createToken = require("./createtoken");
const isAuth = require("./isauth");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const router = express.Router();

router.use(express.static("public"));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(cookieParser());



router.get("/login", async (req, res) => {
    try {
        const user = await isAuth(req);
        //TODO : uncomment before uploading it
        // if (user) {
        //     res.status(200).redirect("/test2");
        // }
        // else {
        //     res.render("login_registeration/login.ejs");
        // }
        res.render("login_registeration/login.ejs");

    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

router.post("/register", async (req, res) => {
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


router.post("/login", async (req, res) => {
    try {
        const user = await isAuth(req);
        const { email, password } = req.body;
        const result = await findUser(email, password, res);
        if (result.status) {
            res.status(result.statuscode).redirect("/test2");
        }
        else {
            res.status(result.statuscode).redirect("/login");
        }


    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }

});

module.exports= router;