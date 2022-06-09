import mongoose from "mongoose";

/**
 * @swagger
 * definitions:
 *   ScamEmail:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       email:
 *         type: string
 *       reportedBy:
 *        type: string
 *       reportedByID:
 *        type: string
 *       dateReported:
 *         type: string
 *         format: date
 */
const scamEmailSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: [true, "Email ID is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
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

export default mongoose.model("ScamEmail", scamEmailSchema);
