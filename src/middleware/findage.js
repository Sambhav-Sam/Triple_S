const UserDetail = require("../models/userDetails");

//function to find the age of the user
const findAge = async (userid)=>{
    const data = await UserDetail.findOne({_id : userid}).select({moreDetail :{dob:1}});
    const dob = data.moreDetail.dob;
    const currdate = Date.now();
    const age = Math.floor((currdate-dob)/(365*86400*1000));
    return age;
}

module.exports = findAge;