import { db } from "../../db/connection.js";

export const createColletion = async (name) => {
  return await db.createCollection(name, {
    validator: { title: { $exists: true } },
  });
};
export const createCollectionCapped = async (name, limt) => {
  return await db.createCollection(name, { capped: true, size: limt });
};
