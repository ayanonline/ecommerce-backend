const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connectDatabase = () => {
  // for atlas db
  const DB = process.env.CLOUD_DB_URL.replace(
    "<password>",
    process.env.DB_PASS
  );
  //conneting database
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // family: 4,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;
