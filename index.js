const express = require("express");
const cors = require("cors");
const connectToMongo = require("./db");
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
connectToMongo();

//Available Routes
app.use("/", require("./routes/root"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port);
