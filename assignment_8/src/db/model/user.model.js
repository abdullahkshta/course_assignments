import mongoose, { Schema } from "mongoose";
import { genderEnum, userRole } from "../../common/enums/index.js";
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
      lowercase: true,
      trim: true,
    },
    lastName: {
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
    },
    age: {
      type: Number,
      min: [18, "the Age Most be Greater Then"],
      max: [60, "the Age Most be littler Then"],
    },
    gender: {
      type: Number,
      enum: Object.values(genderEnum),
      default: genderEnum.male,
    },

    role: {
      type: Number,
      enum: Object.values(userRole),
      default: userRole.user,
    },
  },
  {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    autoIndex: true,
  },
);
userSchema
  .virtual("userName")
  .set(function (value) {
    let [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });
export const userModel = mongoose.model("User", userSchema);
