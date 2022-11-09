const express = require("express");
const bodyParser = require("body-parser");
const randomstring = require("randomstring");
const isAuth = require("../../routes/auth/isauth");
const upload = require("express-fileupload");
const UserDetail = require("../models/userDetails");

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(upload());

router.post("/", async (req, res) => {
    try {
        //authenticating user
        const user = await isAuth(req);
        if (req.files) {
            const file = req.files.image;
            const rstring = randomstring.generate(30);
            const filename = rstring + Date.now() + file.name;
            file.mv('./public/uploads/' + filename, function (err) {
                if (err) {
                    console.log("error while uploading file");
                }
                else {
                    console.log("file uploaded successfully and account created successfully");
                }
            });

            const filter = { _id: user._id };
            const update = {
                userliveimage: {
                    path: filename
                }
            };
            await UserDetail.findOneAndUpdate(filter, update);
            const result = {
                msg: "live photo uploaded sucessfully",
                status: 200
            };
            res.send(JSON.stringify(result));
        }

    } catch (error) {
        console.log(error);
        res.send(error);
    }
});


module.exports = router;