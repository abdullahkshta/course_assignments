import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";

const checkNameLength = (user) => {
  if (!user.name || user.name.length <= 2) {
    throw new Error(`${user.name} => Invaled UserName`);
  }
};
const checkPasswordLength = (user) => {
  if (!user.password || user.password.length <= 6) {
    throw new Error(`Invaled password`);
  }
};
export let userModle = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    role: {
      type: DataTypes.STRING(255),
      enum: ["user", "admin"],
    },
  },
  {
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeCreate: (user) => {
        checkPasswordLength(user);
        checkNameLength(user);
      },
    },
  },
);
