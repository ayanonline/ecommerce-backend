const express = require("express");
const errMidleware = require("./middleware/error");
const cookiParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const { webhookCheckout } = require("./controllers/orderController");

//Route imports
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const cartRoute = require("./routes/cartRoute");
const addressRoute = require("./routes/addressRoute");

// stripe webhook checkout
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

app.use(express.json());
app.use(cookiParser());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: [
    // URL er last e kokhon o '/' debe na

    "http://localhost:5173",
    "https://your-freshgrocery.netlify.app",
    "https://freshgroceri.netlify.app",
    "http://your-freshgrocery.s3-website.ap-south-1.amazonaws.com",
  ],
  credentials: true, // Allow credentials (cookies)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};
app.use(cors(corsOptions));

app.use("/api/v1/products", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/address", addressRoute);

//error middleware for error
app.use(errMidleware);
module.exports = app;
