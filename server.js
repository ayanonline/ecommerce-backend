const app = require("./app");
// const https = require("https");
// const fs = require("fs");

require("dotenv").config();

const connectDatabase = require("./config/database");
// handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to unchaught exception");
  process.exit(1);
});

//connect database function call here
connectDatabase();

// const options = {
//   key: fs.readFileSync("./certificates/key.pem"),
//   cert: fs.readFileSync("./certificates/cert.pem"),
// };

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

// const server = https.createServer(options, app).listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

//unhandle Promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
