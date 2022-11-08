const UserDetail = require("../models/userDetails");

//function to find the age of the user
const findMatches = async (userid)=>{
    const data = await UserDetail.findOne({_id : userid}).select({matches : 1});
    const match_id = data.matches;
    const records = await UserDetail.find({ '_id': { $in: match_id } }).select({moreDetail : {name : 1}});
    return records;
}

module.exports = findMatches;