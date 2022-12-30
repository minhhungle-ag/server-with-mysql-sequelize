const express = require("express");
const { where } = require("sequelize");
const Product = require("../models/product");

const router = express.Router();

router.get("/", async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 15;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  await Product.findAll().then((data) => {
    res
      .status(200)
      .json({
        status: 200,
        data: {
          data: Array.isArray(data) ? data.slice(startIndex, endIndex) : [],
          pagination: {
            page,
            limit,
            totalPage: Math.ceil((data?.length || 0) / limit),
            total: data?.length || 0,
          },
        },
        message: "success",
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
});

router.get("/:id", async (req, res) => {
  const primaryKey = req.params.id;

  await Product.findByPk(primaryKey)
    .then((data) => {
      res.status(200).json({
        status: 200,
        data: data,
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

router.post("/", async (req, res) => {
  await Product.create({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
  })
    .then((data) => {
      res.status(200).json({
        status: 200,
        data: data,
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

router.put("/:id", async (req, res) => {
  const primaryKey = req.params.id;
  const data = await Product.findByPk(primaryKey);

  if (data) {
    data.title = req.body.title;
    data.price = req.body.price;
    data.description = req.body.description;
    data.imageUrl = req.body.imageUrl;

    data
      .save()
      .then((data) => {
        console.log(data);
        res.status(200).json({
          status: 200,
          data: data,
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

    return;
  }

  res.status(400).json({
    message: "not found product",
    data: null,
    status: 400,
  });
});

router.delete("/:id", async (req, res) => {
  const primaryKey = req.params.id;

  await Product.destroy({ where: { id: primaryKey } })
    .then((data) => {
      res.status(200).json({
        status: 200,
        message: "remove success",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: "remove failed",
        data: null,
        status: 400,
      });
    });
});

module.exports = router;
