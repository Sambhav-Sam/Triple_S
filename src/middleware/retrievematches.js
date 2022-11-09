const UserDetail = require("../models/userDetails");

//function to find the age of the user
const findMatches = async (userid)=>{
    const data = await UserDetail.findOne({_id : userid}).select({matches : 1});
    const matches = data.matches;
    let match_id =[];
    await matches.forEach(async element => {
        match_id.push(element.userId);
    });
    const records = await UserDetail.find({ '_id': { $in: match_id } }).select({moreDetail : {name : 1}});
    // console.log(records);
    return records;
}

module.exports = findMatches;