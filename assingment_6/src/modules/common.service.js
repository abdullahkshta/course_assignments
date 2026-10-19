import { db } from "../db/connection.js";
export const insertDocs = async (coll, data) => {
  const document = Array.isArray(data) ? data : [data];
  return await db.collection(coll).insertMany(document);
};
export const addIndex = async (coll, data) => {
  return await db.collection(coll).createIndex(data);
};
export const findBK = async (coll, obj) => {
  return await db.collection(coll).findOne(obj);
};
export const findAll = async (coll, obj) => {
  return await db.collection(coll).find(obj).toArray();
};
export const Update = async (coll, filter, data) => {
  return await db.collection(coll).updateOne(filter, { $set: data });
};
export const getByAggregate = async (coll, query) => {
  return await db.collection(coll).aggregate(query).toArray();
};
export const deleteDocs = async (coll, filter) => {
  return await db.collection(coll).deleteMany(filter);
};
