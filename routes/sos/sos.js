const express = require("express");
const isAuth = require("../auth/isauth");

const router = express.Router();


router.get("/:sosId",async (req,res)=>{
    try {
        const user = await isAuth(req);
        if(user)
        {
            res.status(200).render("sos/location.ejs");
        }
        
    } catch (error) {
        console.log(error);
        res.send(error);
    }   
});

module.exports = router;
