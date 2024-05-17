const express = require("express");
const router = express.Router();
const { studentSignUp, userSignIn,test,fetchStudentData } = require("../controllers/studentController");
const {authorizeStudent} = require("../middlewares/authMiddleware");

router.post("/signUp",studentSignUp); //create student
router.post("/signIn",userSignIn); //login student

router.get("/getStudentData",fetchStudentData);


router.get("/test",authorizeStudent(['student']),test);
router.get("/student/profile", authorizeStudent(["student"]), (req, res) => {
    res.json({ message: "Student profile" });
  });

module.exports = router;   