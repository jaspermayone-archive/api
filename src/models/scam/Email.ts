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
    required: true,
  },
  email: {
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
  },
});

export default mongoose.model("ScamEmail", scamEmailSchema);
