const express = require("express");
const VerifyNumber = require("../models/verifyNumber");
const isAuth = require("../../routes/auth/isauth");
const Vonage = require('@vonage/server-sdk');
const vonage = new Vonage({
    apiKey: "1ae177b3",
    apiSecret: "2iLrou1UglkcR4xD"
});



const router = express.Router();


router.post("/", async (req, res) => {
    try {
        const user = await isAuth(req);
        if (user) {
            const data = await req.body;

            const result = await vonage.verify.request({
                number: "91" + data.number,
                brand: "Cupit"
            });
            console.log(result);
            // const verifyRequestId = result.request_id;

            // const verify = new VerifyNumber({
            //     _id: user._id,
            //     code: verifyRequestId,
            //     number: data.number
            // });
           

        //     const sendotp = await verify.save();
        //     if(sendotp)
        //     {
        //         res.send("otp has been sended to the mobile");
        //     }
        // }
        // else {
        //     res.status(401).send("bad request");
        }

    } catch (error) {
        console.log(error);
        res.send(error);
    }

});


module.exports = router;