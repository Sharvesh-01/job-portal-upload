const mongoose=require("mongoose");
const RecruiterDetailSchema=new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      companyName: {
        type: String,
        required: true
      },
      companyLogo: {
        type: String 
      },
      headQuarters: {
        type: String,
        required: true
      },
      contactNo: {
        type: String,
        required: true
      },
      companyDetails: {
        type: String
      }
},
{
    collecion:"JobRecruiterSignUp",
});
const RecruiterDetail=mongoose.model("jobrecruitersignups",RecruiterDetailSchema);
module.exports=RecruiterDetail;