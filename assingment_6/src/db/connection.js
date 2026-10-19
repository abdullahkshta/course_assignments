import { MongoClient } from "mongodb";
import { db as dbConfig } from "../config/config.service.js";
export let client = new MongoClient(
  "mongodb+srv://abdullahkshta_db_user:1234@cluster0.hb0jokm.mongodb.net/",
);
// let db_name = dbConfig.DB_NAME;
export let db = client.db("library");

export let con = async () => {
  try {
    await client.connect();
    console.log("db connected");
  } catch (err) {
    console.log(err);
  }
};
