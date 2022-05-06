import mongoose from "mongoose";

/**
 * @swagger
 * definitions:
 *   Qotd:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       qotd:
 *         type: string
 *       dateUploaded:
 *         type: string
 *         format: date
 */

const qotdSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    uniqueID: {
        type: String,
        required: true,
    },
    qotd: {
        type: String,
        required: true,
    },
    dateUploaded: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

export default mongoose.model("Qotd", qotdSchema);