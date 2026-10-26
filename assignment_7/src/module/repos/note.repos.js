import { fn } from "./base.repos.js";
import { noteModel, userModel } from "../../db/index.js";
const model = noteModel;
export const createNote = async ({ data }) => {
  const BK = data.userId;
  const exists = await fn.findBK({ model: userModel, BK });
  if (exists) return await fn.create({ model, data });
  return null;
};
export const updateNote = async ({ noteId, userId, data }) => {
  const note = await fn.findBK({ model, BK: noteId });
  if (note) {
    if (note["userId"].toString() == userId.toString()) {
      return await fn.updateOne({ model, filter: noteId, data });
    }
    return undefined;
  }
  return null;
};
export const updateAllNotes = async ({ userId, data }) => {
  const user = await fn.findOne({ model, filter: { userId } });
  if (user) {
    return await fn.updateAll({ model, filter: { userId }, data });
  }
  return null;
};
export const deleteNote = async ({ noteId, userId }) => {
  const note = await fn.findBK({ model, BK: noteId });
  if (note) {
    if (note["userId"].toString() == userId.toString()) {
      return await fn.updateOne({ model, filter: noteId, data });
    }
  }
  return null;
};
export const RetrievePaginated = async ({ where, limit, page, sort }) => {
  return await fn.pagination({
    model,
    where: { userId: where },
    limit,
    page,
    sort,
  });
};
export const findNoteById = async ({ noteId, userId }) => {
  const note = await fn.findBK({ model, BK: noteId });
  if (note) {
    if (note["userId"].toString() == userId.toString()) {
      return { data: note, onwer: true };
    } else {
      return { data: note, onwer: false };
    }
  }
  return null;
};
export const findByContentSearch = async ({ content, userId }) => {
  const note = await fn.findOne({
    model,
    filter: {
      content: {
        $regex: content,
        $options: "i",
      },
    },
  });
  if (note) {
    if (note["userId"].toString() == userId.toString()) {
      return { data: note, onwer: true };
    } else {
      return { data: note, onwer: false };
    }
  }
  return null;
};
export const getNotesAndUserInfo = async ({ userId }) => {
  return await fn.pagination({
    model,
    where: { userId: userId },
    select: "-content -__v -updatedAt",
    populate: { path: "userId", select: "email -_id" },
  });
};
export const getUsingAggregation = async ({ title, userId }) => {
  return await fn.pagination({
    model,
    where: {
      title: {
        $regex: title,
        $options: "i",
      },
      userId: userId,
    },
    select: "-_id title content createdAt",
    populate: { path: "userId", select: "name email -_id" },
  });
};
export const deleteAll = async ({ userId }) => {
  return await fn.deleteAll({ model, filter: { userId } });
};
