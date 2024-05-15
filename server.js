const express = require("express");
const dotenv = require("dotenv").config();
const db = require("./config/db");

const app = express();

const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if(db){ 
   // console.log(db);
    console.log('Connection with databse is successful');
 }else{
    console.log('Error connecting to database');
 }


//url extender
app.use("/api/user", require("./routes/userRoutess"));


app.listen(port,()=>console.log(`App is listening on ${port}`));