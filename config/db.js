const mongoose = require("mongoose");

const { DB_URL } = process.env;

const ConnectWithDb = () => {
  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log(`DB CONNECTED SUCCESSFULLY!!!`))
    .catch((error) => {
      console.log(`DB CONNECTION ISSUES~~~~~~~~`);
      console.log(error);
      process.exit(1);
    });
};

module.exports = ConnectWithDb;
