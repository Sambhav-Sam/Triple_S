const express = require("express");
const bodyParser = require('body-parser');
const UserDetail = require("../../src/models/userDetails");
const isAuth = require("../auth/isauth");

const router = express.Router();
router.use(bodyParser.urlencoded({
    extended: true
}));

//adding more user details

router.post("/", async (req, res) => {
    try {
        const user = await isAuth(req);
        if (user) {
            const { fname, dob, gender } = req.body;
            const userDetail = await UserDetail.findOne({ _id: user._id });
            if (userDetail) {
                //userdetail found , update the user
                const filter = { _id: user._id };
                const update = {
                    moreDetail: {
                        name: fname,
                        dob: dob,
                        gender: gender
                    }
                };
                const newdata = await UserDetail.findOneAndUpdate(filter, update);
                console.log(newdata);
            }
            else {
                //userdetail not found , create the user
                const newdata = await new UserDetail({
                    _id: user._id,
                    moreDetail: {
                        name: fname,
                        dob: dob,
                        gender: gender
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

