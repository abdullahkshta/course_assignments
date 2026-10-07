const express = require("express");
const router = express.Router();
const db = require("../config_db");

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const { name, brand, price, stock_qty, supplier_Id } = body;
    const colName = ["name", "brand", "price", "stock_qty", "supplier_Id"];
    const [rows] = await db.execute(
      `SELECT * FROM product WHERE LOWER(name) = LOWER(?) AND price = ? AND LOWER(brand) = LOWER(?) AND supplier_Id = ?`,
      [name, price, brand, supplier_Id],
    );
    if (rows.length) {
      const UP_status = await db.execute(
        `UPDATE product SET stock_qty = (product.stock_qty +?) WHERE id = ? `,
        [stock_qty, rows[0]["id"]],
      );
      return res.json({
        success: true,
        message: "The quantity is updated because this product is exist",
      });
    }

    let prametars = colName.map(() => "?").join(", ");
    let query = `INSERT INTO product (${colName.join(", ")}) VALUES(${prametars})`;
    const [status] = await db.execute(query, Object.values(body));
    if (status.affectedRows > 0) {
      return res.json({
        success: true,
        message: "product added successfully",
      });
    }
  } catch (err) {
    switch (err.errno) {
      case 1452:
        return res.status(400).json({
          success: false,
          message: "supplier_Id does not exist.",
        });

      default:
        return res.status(500).json({
          success: false,
          message: `there is a problem in the server`,
        });
    }
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const colName = ["name", "brand", "price", "stock_qty", "supplier_Id"];

    const traget_properties = Object.keys(body);
    traget_properties.map((pro) => {
      if (!colName.includes(pro)) {
        return res.status(400).json({
          success: false,
          message: `there is no column name (${pro}) like you send`,
        });
      }
    });
    let query = `UPDATE product SET ${traget_properties.join(" = ? , ")} = ?  WHERE id = ?`;
    let values = Object.values(body);
    values.push(id);
    const [status] = await db.execute(query, values);
    if (status.affectedRows > 0) {
      return res.json({
        success: true,
        message: "product updated successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "product_id does not exist.",
      });
    }
  } catch (err) {
    switch (err.errno) {
      case 1452:
        return res.status(400).json({
          success: false,
          message: "supplier_Id does not exist.",
        });
      default:
        return res.status(500).json({
          success: false,
          message: `there is a problem in the server`,
        });
    }
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(`DELETE FROM product WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    } else {
      return res.json({
        success: true,
        message: "Product Deleted",
      });
    }
  } catch {
    return res.status(500).json({
      success: false,
      message: `there is a problem in the server ${err}`,
    });
  }
});
router.get("/highStock", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id AS product_id, name AS product_name, stock_qty AS stock FROM product ORDER BY stock_qty DESC LIMIT 1`,
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
router.get("/neverSold", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id AS product_id , name AS product_name, stock_qty As stock FROM product p WHERE id NOT IN (SElECT product_id FROM sales)`,
    );
    res.send(rows);
  } catch (err) {
    return res.json({
      success: false,
      message: "there is something worrng in the server " + err,
    });
  }
});
router.get("/{:id}", async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const [result] = await db.execute(`SELECT * FROM product where id = ?`, [
        id,
      ]);
      if (result.length) {
        return res.json(result);
      } else {
        return res.status(400).json({ massage: "There is no Id product" });
      }
    }
    const [result] = await db.execute("SELECT * FROM product");
    if (result.length) {
      return res.json(result);
    } else {
      return res.status(400).json({ massage: "There is no product" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ massage: "there is a problem in the server" });
  }
});

module.exports = router;
