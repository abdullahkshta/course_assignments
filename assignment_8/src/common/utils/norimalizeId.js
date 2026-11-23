import mongoose from "mongoose";

export const normalizeId = (id) => new mongoose.Types.ObjectId(id);
