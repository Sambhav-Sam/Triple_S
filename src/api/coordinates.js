const express = require("express");
const bodyParser = require("body-parser");
const isAuth = require("../../routes/auth/isauth");
const axios = require('axios');
const UserDetail = require("../models/userDetails");

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.post("/", async (req, res) => {
    try {
        //authenticating user
        const user = await isAuth(req);

        //api to convert coordinates into city name and postal code
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${req.body.latitude}&lon=${req.body.longitude}&zoom=18&addressdetails=1`);

        console.log(response.data);
        const city = response.data.address.state_district;
        const postalCode = response.data.address.postcode;

        //fetching data from userdetail model
        const data = await UserDetail.findOne({ _id: user._id });
        if (data) {
            //if user found updating the location details
            const filter = { _id: user._id };
            const update = {
                location: {
                    lat: req.body.latitude,
                    lon: req.body.longitude,
                    city: city,
                    postcode: postalCode
                }
            };
            const newdata = await UserDetail.findOneAndUpdate(filter, update);
            console.log(newdata);
        }
        else {
            //else creating the new user with the location details
            const newdata = await new UserDetail({
                _id: user._id,
                location: {
                    lat: req.body.latitude,
                    lon: req.body.longitude,
                    city: city,
                    postcode: postalCode
                }
            }).save();

            console.log(newdata);
        }


    } catch (error) {
        console.log(error);
        res.send(error);
    }
});


module.exports = router;