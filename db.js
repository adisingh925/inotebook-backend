const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const connectToMongo = async () => {
  await mongoose.connect(process.env.DATABASE_PATH);
};

module.exports = connectToMongo;
