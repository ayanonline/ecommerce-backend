const express = require("express");
const errMidleware = require("./midleware/error");
const cookiParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const bodyParser = require("body-parser");

app.use(express.json());
app.use(cookiParser());
app.use(bodyParser.urlencoded({ extended: true }));

// cross domain
app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors());
app.options("*", cors());

//Route imports
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const cartRoute = require("./routes/cartRoute");

app.use("/api/v1/products", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/cart", cartRoute);

//error middleware for error
app.use(errMidleware);
module.exports = app;
