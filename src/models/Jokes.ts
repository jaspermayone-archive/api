import mongoose from "mongoose";

/**
 * @swagger
 * definitions:
 *   Joke:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       joke:
 *         type: string
 *       dateUploaded:
 *         type: string
 *         format: date
 */

const jokeSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  joke: {
    type: String,
    required: true,
  },
  dateUploaded: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// export model
export default mongoose.model("Joke", jokeSchema);
