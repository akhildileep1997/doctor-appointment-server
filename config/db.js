const mongoose = require("mongoose");

const DB = process.env.Mongo_Url;

mongoose
  .connect(DB)
  .then(() => {
    console.log(`Database Connection established successfully `);
  })
  .catch(() => {
    console.log("error connecting with mong db");
  });
