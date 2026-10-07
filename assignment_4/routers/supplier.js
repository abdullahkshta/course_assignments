const express = require("express");
const router = express.Router();
const db = require("../config_db");

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const colName = ["name", "contact_number"];

    let prametars = colName.map(() => "?").join(", ");
    let query = `INSERT INTO supplier (${colName.join(", ")}) VALUES(${prametars})`;
    let values = colName.map((item) => body[item]);
    const [status] = await db.execute(query, values);
    if (status.affectedRows > 0) {
      return res.json({
        success: true,
        message: "product added successfully",
      });
    }
  } catch (err) {
    if (err.errno == 1062) {
      return res.json({
        success: false,
        message: "there is supplier's number here",
      });
    }
    res
      .status(500)
      .json({ massage: "there is a problem in the server" + error.err });
  }
});
router.get("/byName", async (req, res) => {
  try {
    let { Name } = req.query;
    Name = `${Name.toLowerCase()}%`;
    const [rows] = await db.execute(
      `SELECT * FROM supplier where LOWER(name) like LOWER(?)`,
      [Name],
    );
    if (rows.length) {
      return res.json({ success: true, data: rows });
    } else {
      res.status(400).json({
        success: false,
        message: `there are no suppliers Name starts with ${Name.slice(0, -1)}`,
      });
    }
  } catch (err) {
    return res.json({
      success: false,
      message: "there is something worrng in the server " + err,
    });
  }
});
router.get("/", async (req, res) => {
  try {
    const [result] = await db.execute(`SELECT * FROM supplier`);
    if (result.length) {
      return res.json({
        success: true,
        message: "data fetching",
        data: result,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "suppliers not found",
      });
    }
  } catch {
    res.status(500).json({ massage: "there is a problem in the server" });
  }
});
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const colName = ["name", "contact_number"];
  try {
    const traget_properties = Object.keys(body);
    traget_properties.map((pro) => {
      if (!colName.includes(pro)) {
        return res.status(400).json({
          success: false,
          message: `there is no column name (${pro}) like you send`,
        });
      }
    });
    let query = `UPDATE supplier SET ${traget_properties.join(" = ? , ")} = ?  WHERE id = ?`;
    let values = Object.values(body);
    values.push(id);
    console.log(values);
    const [status] = await db.execute(query, values);
    if (status.affectedRows > 0) {
      return res.json({
        success: true,
        message: "supplier updated successfully",
      });
    } else {
      return res.json({
        success: false,
        message: `there is no supplier id ->(${id})`,
      });
    }
  } catch (error) {
    if (error.errno === 1062) {
      return res.json({
        success: false,
        message: "there is supplier's number exists",
      });
    }
    res.status(500).json({ massage: "there is a problem in the server" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(`DELETE FROM supplier WHERE id = ?`, [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Supplier Id not found",
      });
    } else {
      return res.json({
        success: true,
        message: "Supplier Deleted",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `there is a problem in the server${err}`,
    });
  }
});
module.exports = router;
