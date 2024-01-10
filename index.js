require("dotenv").config();

const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const userRoute = require("./routes/authRoutes");
const adminRoute = require("./routes/adminROutes")
const doctorRoute = require('./routes/doctorRoutes')

require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Use the userRoute for routes
app.use("/user", userRoute);
app.use('/admin', adminRoute)
app.use('/doctor',doctorRoute)

app.listen(PORT, () => {
  console.log("App is listening on PORT " + PORT);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});
