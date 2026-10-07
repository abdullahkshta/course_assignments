const mysql = require("mysql2/promise");
require("dotenv").config({ path: "db.env" });
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
};
async function createDataBaseIsNotExists(databaseName) {
  try {
    const tempConnection = await mysql.createConnection(dbConfig);
    await tempConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\``,
    );
    await tempConnection.query(`USE \`${databaseName}\``);
    await tempConnection.query(`
      CREATE TABLE IF NOT EXISTS supplier (id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR (50) NOT NULL ,
      contact_number VARCHAR(50) NOT NULL UNIQUE)`);
    await tempConnection.query(`
    CREATE TABLE IF NOT EXISTS product (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR (50) NOT NULL ,
    brand VARCHAR (40) NOT NULL,
    price DECIMAL (10,2) NOT NULL,
    stock_qty INT NOT NULL CHECK (stock_qty >=0),
    supplier_Id INT NULL,
    CONSTRAINT supplying FOREIGN KEY (supplier_id) REFERENCES supplier(id) ON UPDATE CASCADE ON DELETE SET NULL)`);
    await tempConnection.query(`CREATE TABLE IF NOT EXISTS sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NULL ,
    qty_sold INT NOT NULL CHECK (qty_sold >= 1) ,
    sale_date DATE DEFAULT (CURRENT_DATE) NOT NULL,
    CONSTRAINT saling FOREIGN KEY (product_id) REFERENCES product(id) ON UPDATE CASCADE ON DELETE SET NULL )`);
    await tempConnection.end();
  } catch (err) {
    console.log(
      err,
      "there is something worrng during checking/creating database",
    );
  }
}
createDataBaseIsNotExists(process.env.DB_NAME);
const db = mysql.createPool({
  ...dbConfig,
  database: process.env.DB_NAME,
});
const test = async () => {
  try {
    const [rows] = await db.execute(`DESC product`, []);
    console.log(rows);
  } catch {}
};
// test();
module.exports = db;
