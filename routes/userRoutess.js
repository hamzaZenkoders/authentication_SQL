const express = require("express");
const router = express.Router();
const { userSignUp } = require("../controllers/userController");

router.post("/signUp",userSignUp);

module.exports = router;