const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const file = require("./Routers/file");
dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cors());
// Router
app.use("/api/file", file);

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

//Check Connect to Mongodb
const connect = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGODB);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});
// Port listening
const port = process.env.PORT || 5000;
app.listen(port, function () {
  connect();
  console.log("Connected to databse");
  console.log("Server linstening in " + port);
});
