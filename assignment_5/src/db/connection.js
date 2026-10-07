import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
import { db } from "../config/config.service.js";

export const sequelize = new Sequelize(db.DB_NAME, db.DB_USER, db.DB_PASS, {
  host: db.DB_HOST,
  dialect: db.DB_DIALECT,
  pool: {
    max: db.DB_MAX,
    min: db.DB_MIN,
  },
});

export const connect = async () => {
  try {
    const con = await mysql.createConnection({
      host: db.DB_HOST,
      user: db.DB_USER,
      password: db.DB_PASS,
    });
    await con.query(`CREATE DATABASE IF NOT EXISTS ${db.DB_NAME} ; `);
    await con.end();
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });
  } catch (err) {
    console.log("there is a problem in the connections");
  }
};
