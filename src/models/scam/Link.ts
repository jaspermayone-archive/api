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
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["unknown", "discord", "instagram", "other"],
    required: true,
    default: "unknown",
  },
  reportedBy: {
    type: String,
    required: true,
  },
  reportedByID: {
    type: String,
    required: true,
  },
  dateReported: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export default mongoose.model("ScamLink", scamLinkSchema);
