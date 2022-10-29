const express = require("express");
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.urlencoded({
    extended: true
}));

//auth with google 
router.get("/",(req,res)=>{
    console.log("hello");
});

router.post("/",(req,res)=>{
    console.log(req.body);
});


module.exports = router;

