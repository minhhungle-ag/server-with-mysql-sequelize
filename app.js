const express = require("express");
const morgan = require("morgan");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");

const productRouters = require("./api/routes/product");

const app = express();
dotEnv.config();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATH, DELETE");
    return res.status(200).json({});
  }

  next();
});

app.use("/api/products", productRouters);

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
