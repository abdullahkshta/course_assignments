import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 20,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[a-zA-Z].*@[a-zA-Z]+\.(com|net|org)$/,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 20,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    match: /^01(0|1|2|5){1}[0-9]{8}$/,
  },
  age: {
    type: Number,
    min: [18, "the Age Most be Greater Then"],
    max: [60, "the Age Most be littler Then"],
  },
});
userSchema.virtual("userNotes", {
  ref: "notes",
  localField: "_id",
  foreignField: "userId",
  justOne: false,
});
export const userModel = mongoose.model("user", userSchema);
