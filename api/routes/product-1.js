const express = require("express");
const db = require("../../utils/database");

const router = express.Router();

router.get("/", (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 15;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  db.execute("SELECT * FROM products")
    .then((response) => {
      const [data, field] = response;

      res.status(200).json({
        status: 200,
        data: {
          data: Array.isArray(data) ? data.slice(startIndex, endIndex) : [],
          pagination: {
            page,
            limit,
            totalPage: Math.ceil((data?.length || 0) / limit),
            total: data.length,
          },
        },
        message: "success",
      });
    })
    .catch((error) => {
      console.log("get product error");
      res.status(400).json({
        message: "failed",
        data: null,
        status: 400,
      });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.execute("SELECT * FROM products WHERE products.id = ?", [id])
    .then((result) => {
      const [data] = result;
      res.status(200).json({
        status: 200,
        data: data[0] || null,
        message: "success",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: "failed",
        data: null,
        status: 400,
      });
    });
});

router.post("/", (req, res) => {
  db.execute(
    "INSERT INTO products (title, price, imageUrl, description) VALUE (?, ?, ?, ?)",
    [req.body.title, req.body.price, req.body.imageUrl, req.body.description]
  )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: "failed",
        data: null,
        status: 400,
      });
    });
});

module.exports = router;
