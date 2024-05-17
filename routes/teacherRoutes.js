const express = require("express");
const router = express.Router();
const {teacherSignUp} = require("../controllers/teacherController");

router.post("/signUp",teacherSignUp);


module.exports = router;   