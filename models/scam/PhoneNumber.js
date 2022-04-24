import mongoose from "mongoose";

 const scamPhoneNumberSchema = new mongoose.Schema({
     _id: {
         type: String,
         required: true,
     },
     phoneNumber: {
         type: String,
         required: true,
     },
     reportedBy: {
         type: String,
         required: true,
     },
     reportedByID: {
         type: String,
     },
     dateReported: {
         type: Date,
         default: Date.now,
         required: true,
     }
 });

 export default mongoose.model("ScamPhoneNumber", scamPhoneNumberSchema);