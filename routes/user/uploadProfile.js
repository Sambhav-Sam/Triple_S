const express = require("express");
const bodyParser = require('body-parser');
const expressFileUpload = require("express-fileupload");
const randomstring = require("randomstring");
const UserDetail = require("../../src/models/userDetails");
const isAuth = require("../auth/isauth");


const router = express.Router();
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(expressFileUpload());

//adding more user details

router.get("/", async (req, res) => {
    try {
        const user = await isAuth(req);
        if (user) {
            res.status(200).render("uploadprofile/uploadProfile.ejs");
        }
        else {
            res.status(401).send("bad request");
        }
        
    } catch (error) {
        console.log(error);
        res.send(error);
    }

});

router.post("/",async(req,res)=>{
    try {
        const user = await isAuth(req);
        if(req.files){
            const file = req.files.userImage;
            const rstring = randomstring.generate(30);
            const filename = rstring +Date.now()+ file.name;
            file.mv('./uploads/'+filename ,function(err){
                if(err){
                    console.log("error while uploading file");
                }
                else{
                    res.send("file uploaded successfully and account created successfully");
                }
            });
        }
        
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});


module.exports = router;

