import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// create user model
const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4(),
    required: true,
  },
  accountType: {
    type: String, enum: ["user", "bot", "admin"],
    default: "user",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export default mongoose.model("User", userSchema);
