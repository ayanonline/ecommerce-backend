const express = require("express");
const errMidleware = require("./midleware/error");
const cookiParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cookiParser());

// cross domain
app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Route imports
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const cartRoute = require("./routes/cartRoute");

app.use("/api/v1", productRoute);
app.use("/api/v1/", userRoute);
app.use("/api/v1/", orderRoute);
app.use("/api/v1/", cartRoute);

//error middleware for error
app.use(errMidleware);
module.exports = app;
