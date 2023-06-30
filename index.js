const express = require("express");
const connectToMongo = require("./db");
const cors = require("cors");
const app = express();
const port = process.env.PORT;
connectToMongo();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

//Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
