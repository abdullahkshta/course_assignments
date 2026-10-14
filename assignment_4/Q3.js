const express = require("express");
const app = express();
const PORT = 3000;
const db = require("./config_db");
const R_products = require("./routers/product.js");
const R_supplier = require("./routers/supplier.js");
const R_sales = require("./routers/sales.js");

app.use(express.json());
app.use("/product", R_products);
app.use("/supplier", R_supplier);
app.use("/sales", R_sales);
app.patch("/alter/:fn", async (req, res) => {
  const { fn } = req.params,
    { table, column, properties } = req.body;

  Object.values(req.body).map((item) => {
    if (typeof item === "object" && item !== null && !Array.isArray(item)) {
      Object.values(item).map((i) => {
        if (typeof i !== "boolean" && i.includes(";")) {
          return res
            .status(400)
            .json({ massage: `( ${i} ) value doesn't match with the roles` });
        }
      });
    } else {
      if (item.includes(";")) {
        return res
          .status(400)
          .json({ massage: `( ${item} ) value doesn't match with the roles` });
      }
    }
  });
  let type;
  let nullable;
  let unique;
  let field;
  if (properties) {
    field = field ? field : column;
    type = properties.type;
    nullable = properties.nullable ? "NULL" : "NOT NULL";
    unique = properties.unique ? "UNIQUE" : "";
  }
  let [result] = "";
  try {
    switch (fn) {
      case "add": {
        [result] = await db.execute(
          `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${column} ${type} ${nullable} ${unique} `,
        );
        if (result.warningStatus > 0) {
          return res.status(400).json({
            success: false,
            massage: `column ${column} is aready exists `,
          });
        } else {
          return res.json({
            success: true,
            massage: `column ${column} is created `,
          });
        }
      }
      case "remove": {
        [result] = await db.execute(
          `ALTER TABLE ${table} DROP COLUMN IF EXISTS ${column}`,
          [table, column],
        );
        if (result.warningStatus > 0) {
          return res.status(400).json({
            success: false,
            massage: `column ${column} is not exists `,
          });
        } else {
          return res.json({
            success: true,
            massage: `column ${column} is removed `,
          });
        }
      }
      case "edit": {
        [result] = await db.execute(
          `ALTER TABLE ${table} CHANGE COLUMN IF EXISTS ${column} ${field} ${type} ${nullable} ${unique} `,
        );
        return res.json({
          success: true,
          massage: `column ${column} is edited `,
        });
      }
    }
    res.json({
      "dataParams ": req.params,
      dataBody: req.body,
    });
    console.log(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "there is no result for this request " + err,
    });
  }
});
app.post("/users/set-upMange", async (req, res) => {
  try {
    const { u_name, host, u_pass } = req.body;
    await db.query(`CREATE USER IF NOT EXISTS ??@?? IDENTIFIED BY ? `, [
      u_name,
      host,
      u_pass,
    ]);
    await db.query(`GRANT SELECT, INSERT, UPDATE ON store.* TO ??@?? `, [
      u_name,
      host,
    ]);
    return res.json({ message: "done" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "there is something worrng in the server " + err,
    });
  }
});
app.put("/users/set-upMange", async (req, res) => {
  try {
    const body = req.body;
    const attributes = [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE",
      "CREATE",
      "DROP",
      "ALTER",
    ];
    const methods = ["GRANT", "REVOKE"];
    const method = methods.filter(
      (meth) => meth == body["method"].toUpperCase(),
    );
    if (
      body.u_name &&
      body.host
    ) // i have to set values to compare it with this data
    {
      body.att.map((attr, index) => {
        if (!attributes.includes(attr.toUpperCase())) {
          console.log(false);
        } else {
          body.att[index] = attr.toUpperCase();
        }
      });
      if (body.att.includes("DELETE") && method == "GRANT") {
        await db.query(
          `${method} ${body.att.join(", ")} ON store.sales ${method == "REVOKE" ? "FROM" : "TO"} ??@??`,
          [body.u_name, body.host],
        );
      } else {
        await db.query(
          `${method} ${body.att.join(", ")} ON store.* ${method == "REVOKE" ? "FROM" : "TO"} ??@??`,
          [body.u_name, body.host],
        );
      }
    }
    res.json(`done`);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "there is something worrng in the server " + err,
    });
  }
});
app.use((err, req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "there is no result for this request " + err,
  });
});
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
