const express = require("express");
const dotenv = require("dotenv").config();
require("dotenv").config();

//const { getConnection } = require("./config/db.js");
//const db = require("./config/db");

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/* 
if (db) {
  // console.log(db);
  console.log("Connection with databse is successful");
} else {
  console.log("Error connecting to database");
} */

//url extender
app.use("/api/student", require("./routes/studentRoutes.js"));
app.use("/api/teacher", require("./routes/teacherRoutes.js"));
app.use("/api/course", require("./routes/courseRoutes.js"));
app.listen(port, () => console.log(`App is listening on ${port}`));
