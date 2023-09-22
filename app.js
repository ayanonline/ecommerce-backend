const express = require("express");
const errMidleware = require("./middleware/error");
const cookiParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const bodyParser = require("body-parser");

app.use(express.json());
app.use(cookiParser());
app.use(bodyParser.urlencoded({ extended: true }));

// cross domain
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT,PATCH, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Credentials", "true"); // Set this to 'true'
//   next();
// });
const corsOptions = {
  origin: ["http://localhost:5173", "https://your-freshgrocery.netlify.app/"],
  credentials: true, // Allow credentials (cookies)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};
app.use(cors(corsOptions));
app.options("*", cors());

//Route imports
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const cartRoute = require("./routes/cartRoute");
const addressRoute = require("./routes/addressRoute");

app.use("/api/v1/products", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/address", addressRoute);

//error middleware for error
app.use(errMidleware);
module.exports = app;
