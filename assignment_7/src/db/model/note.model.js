import mongoose, { Schema } from "mongoose";
const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
  },
  {
    timestamps: true,
  },
);
export const noteModel = mongoose.model("notes", NoteSchema);
