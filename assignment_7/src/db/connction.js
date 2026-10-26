import mongoose, { syncIndexes } from "mongoose";
import { URI } from "../config/comfig.service.js";
export async function con() {
  await mongoose.connect(URI);
  await syncIndexes();
  console.log("done");
}
