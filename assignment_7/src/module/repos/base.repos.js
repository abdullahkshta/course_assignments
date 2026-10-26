export const fn = {
  create: async ({ model, data }) => {
    return await model.create(data);
  },
  pagination: async ({
    model,
    where,
    limit,
    page = 1,
    sort,
    populate,
    select,
  }) => {
    let skip;
    if (limit) {
      skip = (page - 1) * limit;
    }
    const data = await model
        .find(where || {})
        .skip(skip)
        .limit(limit || undefined)
        .sort(sort || undefined)
        .populate(populate ? populate : undefined)
        .select(select ? select : undefined),
      total = await model.countDocuments(where),
      totalPage = limit ? Math.ceil(total / limit) : 1;
    return {
      data,
      curPage: page,
      total,
      totalPage,
      hasNextPage: page < totalPage,
      hasPreviousPage: page > 1,
    };
  },
  updateOne: async ({ model, filter, data }) => {
    return await model.findOneAndUpdate(
      filter,
      { $set: data },
      { returnDocument: "after", runValidators: true },
    );
  },
  updateAll: async ({ model, filter, data }) => {
    return await model.updateMany(
      filter,
      { $set: data },
      { runValidators: true },
    );
  },
  deleteOne: async ({ model, filter }) => {
    return await model.deleteOne({ filter });
  },
  findBK: async ({ model, BK }) => {
    return await model.findById(BK);
  },
  findOne: async ({ model, filter }) => {
    return await model.findOne(filter);
  },
  deleteAll: async ({ model, filter }) => {
    return await model.deleteMany(filter);
  },
};
