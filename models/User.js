import mongoose from "mongoose";

// create user model
const userSchema = new mongoose.Schema({
  _id: {
    type: String,
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
