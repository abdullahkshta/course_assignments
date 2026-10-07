const express = require("express");
const router = express.Router();
const db = require("../config_db");

router.post("/", async (req, res) => {
  try {
    const { id, qty, date } = req.body;
    const [rows] = await db.execute(
      "UPDATE product SET stock_qty = (product.stock_qty - ?) WHERE id = ?",
      [qty, id],
    );
    const [sales] = await db.execute(
      "INSERT INTO sales (product_id , qty_sold ,sale_date ) VALUES(?,?,?)",
      [id, qty, date ? date : new Date()],
    );
    if (sales.affectedRows > 0) {
      return res.json({
        success: true,
        message: `sale transAction is recorded`,
      });
    }
  } catch (error) {
    if (error.errno === 3819 || error.errno === 4025) {
      return res.status(400).json({
        success: false,
        message: `there are no empth quantity of this product`,
      });
    }
    return res.status(500).json({
      success: false,
      message: `there is something worrng in the server ` + error,
    });
  }
});
router.get("/forProduct", async (req, res) => {
  try {
    const { name } = req.query;
    const [result] = await db.execute(
      `SELECT * FROM product WHERE LOWER(name) = LOWER(?)`,
      [name],
    );
    if (result.length) {
      let F_data = [];
      for await (let { id, brand } of result) {
        const data = await db.execute(
          `SELECT p.name AS product_name, sa.id AS sale_id, p.price AS unit_price, sa.qty_sold AS
           units_sold,(p.price * sa.qty_sold) AS total_amount, sa.sale_date FROM sales sa INNER JOIN product p ON sa.product_id = p.id WHERE sa.product_id = ? `,
          [id],
        );
        F_data = [
          ...F_data,
          { brand: `the porduct from ${brand ? brand : "(xxxxxxx)"}` },
          data[0],
        ];
      }
      return res.json(F_data);
    } else {
      return res
        .status(400)
        .json({ massage: `there are no prodects named ${name}` });
    }
  } catch {
    return res
      .status(500)
      .json({ massage: "there is a problem in the server" });
  }
});

router.get("/", async (req, res) => {
  try {
    const [result] = await db.execute(`SELECT * FROM sales`);
    if (result.length) {
      return res.json(result);
    } else {
      return res.status(400).json({ massage: "there are no sales" });
    }
  } catch {
    res.status(500).json({ massage: "there is a problem in the server" });
  }
});
router.get("/ForEachPordcut", async (req, res) => {
  try {
    const [result] = await db.execute(`
       SELECT s.product_id, p.name, SUM(s.qty_sold) AS unit_Sold,p.price AS unit_pirce,
       (SUM(s.qty_sold) * p.price) AS Totle_amount
       FROM sales s INNER JOIN product p WHERE p.id = s.product_id GROUP BY s.product_id`);
    if (result.length) {
      return res.json(result);
    }
  } catch (err) {
    return res.json({
      success: false,
      message: "there is something worrng in the server " + err,
    });
  }
});
router.get("/allSales", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT  p.name AS NameProduct, s.qty_sold AS quantity_sold, s.sale_date FROM sales s INNER JOIN product p WHERE p.id = s.product_id GROUP BY s.id `,
    );
    if (rows.length) {
      return res.json({ success: true, data: rows });
    }
  } catch (err) {
    return res.json({
      success: false,
      message: "there is something worrng in the server " + err,
    });
  }
});

module.exports = router;
