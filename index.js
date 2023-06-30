const express = require("express");
const connectToMongo = require("./db");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const port = 65500;
connectToMongo();
dotenv.config({ path: "./.env" });

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000","https://inotebook-71291.web.app/"],
  })
);

//Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
