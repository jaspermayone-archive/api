import mongoose from "mongoose";

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       accountType:
 *         type: string
 *       date_created:
 *         type: string
 *         format: date
 */

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "User ID is required"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  accountType: {
    type: String,
    enum: ["user", "bot", "admin"],
    default: "user",
    required: [true, "Account type is required"],
  },
  hasLockedAccess: {
    type: Boolean,
    default: false,
    required: [true, "Has locked access is required"],
  },
  dateCreated: {
    type: Date,
    default: Date.now,
    required: [true, "Date created is required"],
  },
});

export default mongoose.model("User", userSchema);
