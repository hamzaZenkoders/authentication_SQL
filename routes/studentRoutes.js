const express = require("express");
const router = express.Router();
const { studentSignUp, userSignIn,test,fetchStudentData,updateStudentData,deleteStudentData } = require("../controllers/studentController");
const {authorizeStudent} = require("../middlewares/authMiddleware");

router.post("/signUp",studentSignUp); //create student
router.post("/signIn",userSignIn); //login student

router.get("/getStudentData/:id",authorizeStudent(['student']),fetchStudentData); //get student

router.put("updateStudent/:id",authorizeStudent(['student']),updateStudentData); //update student

router.delete("/deleteStudent/:id",authorizeStudent(['student']),deleteStudentData); //delete student

module.exports = router;   