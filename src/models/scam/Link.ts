import mongoose from "mongoose";

/**
 * @swagger
 * definitions:
 *   ScamLink:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       link:
 *         type: string
 *       type:
 *        type: string
 *       reportedBy:
 *        type: string
 *       reportedByID:
 *        type: string
 *       dateReported:
 *         type: string
 *         format: date
 */
const scamLinkSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: [true, "Link ID is required"],
    unique: true,
  },
  link: {
    type: String,
    required: [true, "Link is required"],
    unique: true,
  },
  type: {
    type: String,
    enum: ["unknown", "discord", "instagram", "other"],
    required: [true, "Type is required"],
    default: "unknown",
  },
  reportedBy: {
    type: String,
    required: [true, "Reported By is required"],
  },
  reportedByID: {
    type: String,
    required: [true, "Reported By ID is required"],
  },
  dateReported: {
    type: Date,
    default: Date.now,
    required: [true, "Date is required"],
  },
});

export default mongoose.model("ScamLink", scamLinkSchema);
