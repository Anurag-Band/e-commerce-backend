const app = require("./app");
require("dotenv").config();
const { PORT } = process.env;
const ConnectWithDb = require("./config/db");
const cloudinary = require("cloudinary");

// To connect with Mongodb database
ConnectWithDb();

// cloudinary config goes here

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.listen(PORT, () => console.log(`Server is Running at PORT : ${PORT}`));
