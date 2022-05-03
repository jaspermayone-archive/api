import mongoose from "mongoose";

/**
 * @swagger
 * definitions:
 *   ScamPhoneNumber:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       phoneNumber:
 *         type: string
 *       reportedBy:
 *        type: string
 *       reportedByID:
 *        type: string
 *       dateReported:
 *         type: string
 *         format: date
 */
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