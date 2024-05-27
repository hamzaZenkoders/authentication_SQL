const express = require("express");
const router = express.Router();
const {
  studentSignUp,
  studentSignIn,
  fetchStudentData,
  updateStudentData,
  deleteStudentData,
  fetchAllStudentsData,
} = require("../controllers/studentController");
const { authorizeToken } = require("../middlewares/authMiddleware");

router.post("/signUp", studentSignUp); //create student
router.post("/signIn", studentSignIn); //login student

router.get("/getStudentData/:id", authorizeToken, fetchStudentData); //get student

router.get("/getStudentsData", fetchAllStudentsData); //get students

router.patch("/updateStudent/:id", authorizeToken, updateStudentData); //update student

router.delete("/deleteStudent/:id", authorizeToken, deleteStudentData); //delete student

module.exports = router;
