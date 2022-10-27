import mongoose from "mongoose";

/**
 * @swagger
 * definitions:
 *   Qotd:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       qotd:
 *         type: string
 *       dateUploaded:
 *         type: string
 *         format: date
 */

const qotdSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Qotd ID is required"],
    unique: true,
  },
  qotd: {
    type: String,
    required: [true, "Qotd is required"],
    unique: true,
  },
  dateUploaded: {
    type: Date,
    default: Date.now,
    required: [true, "Date is required"],
  },
});

export default mongoose.model("Qotd", qotdSchema);
