import mongoose from "mongoose";

/**
 * @swagger
 * definitions:
 *   Quote:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       quote:
 *         type: string
 *       author:
 *         type: string
 *       dateUploaded:
 *         type: string
 *         format: date
 */

const quoteSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Quote ID is required"],
    unique: true,
  },
  quote: {
    type: String,
    required: [true, "Quote is required"],
    unique: true,
  },
  author: {
    type: String,
    required: [true, "Author is required"],
  },
  dateUploaded: {
    type: Date,
    default: Date.now,
    required: [true, "Date is required"],
  },
});

export default mongoose.model("Quote", quoteSchema);
