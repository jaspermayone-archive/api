import mongoose from "mongoose";

/**
 * @swagger
 * definitions:
 *   ScamPhoneNumber:
 *     type: object
 *     properties:
 *       id:
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
  id: {
    type: String,
    required: [true, "Phone Number ID is required"],
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone Number is required"],
    unique: true,
  },
  reportedBy: {
    type: String,
    required: [true, "Reported By is required"],
  },
  reportedByID: {
    type: String,
  },
  dateReported: {
    type: Date,
    default: Date.now,
    required: [true, "Date is required"],
  },
});

export default mongoose.model("ScamPhoneNumber", scamPhoneNumberSchema);
