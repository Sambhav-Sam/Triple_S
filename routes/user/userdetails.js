const express = require("express");
const bodyParser = require('body-parser');
const randomstring = require('randomstring');
const UserDetail = require("../../src/models/userDetails");
const upload = require("express-fileupload");
const isAuth = require("../auth/isauth");

const router = express.Router();
router.use(express.static("public"));
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(upload());


//get route
router.get("/", async (req, res) => {
    try {
        const user = await isAuth(req);
        if (user) {
            res.status(200).render("login_registeration/buildprofile.ejs");
        }
        else {
            res.status(401).send("bad request");
        }
    }
    catch (err) {
        res.status(401).send(err);
    }
});

//adding more user details

router.post("/", async (req, res) => {
    try {
        const user = await isAuth(req);
        if (user) {
            const { fname, dob, gender, phone, Preference } = req.body;


            //saving the files
            if (req.files) {
                const file = req.files.image;
                const rstring = randomstring.generate(30);
                const filename = rstring + Date.now() + file.name;
                file.mv('./public/uploads/' + filename, function (err) {
                    if (err) {
                        console.log("error while uploading file");
                    }
                    else {
                        // res.send("file uploaded successfully and account created successfully");
                    }
                });

                const filter = { _id: user._id };
                const update = {
                    userprofileimage: {
                        path: filename
                    }
                };
                const result = await UserDetail.findOneAndUpdate(filter, update);
                console.log(result);
            }

            //saving the data
            const userDetail = await UserDetail.findOne({ _id: user._id });
            if (userDetail) {
                //userdetail found , update the user
                const filter = { _id: user._id };
                const update = {
                    moreDetail: {
                        name: fname,
                        dob: dob,
                        gender: gender,
                        phone: phone,
                        preference: Preference
                    }
                };
                const newdata = await UserDetail.findOneAndUpdate(filter, update);
                console.log(newdata);
            }
            else {
                //userdetail not found , create the user
                const newdata = await new UserDetail({
                    _id: user._id,
                    suscribed : false,
                    moreDetail: {
                        name: fname,
                        dob: dob,
                        gender: gender,
                        phone: phone,
                        preference: Preference
                    }
                }).save();

                console.log(newdata);

            }
        }
        else {
            res.status(401).send("not authorized");
            console.log("not authorized");
        }
    } catch (error) {
        console.log(error);
        res.send(error);
    }

});


module.exports = router;

