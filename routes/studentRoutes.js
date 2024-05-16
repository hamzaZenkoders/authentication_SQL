const express = require("express");
const router = express.Router();
const { userSignUp, userSignIn } = require("../controllers/userController");

router.post("/signUp",userSignUp);
router.post("/signIn",userSignIn);

module.exports = router;