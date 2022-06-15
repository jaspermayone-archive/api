import mongoose from "mongoose";

/**
 * @swagger
 * definitions:
 *   Joke:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       joke:
 *         type: string
 *       dateUploaded:
 *         type: string
 *         format: date
 */

const jokeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Joke ID is required"],
    unique: true,
  },
  joke: {
    type: String,
    required: [true, "Joke is required"],
    unique: true,
  },
  dateUploaded: {
    type: Date,
    default: Date.now,
    required: [true, "Date is required"],
  },
});

// export model
export default mongoose.model("Joke", jokeSchema);
