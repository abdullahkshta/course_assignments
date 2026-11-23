import mongoose, { syncIndexes } from "mongoose";
import { configService } from "../config/comfig.service.js";
export async function con() {
  try {
    await mongoose.connect(configService.URI);
    await syncIndexes();
    console.log("done");
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}
