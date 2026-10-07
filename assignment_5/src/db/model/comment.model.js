import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";

export let commentModle = sequelize.define(
  "comment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);
