const express = require("express");
const router = express.Router();
const {
  teacherSignUp,
  teacherSignIn,
  getAllTeachers,
  getTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");
const { authorizeToken } = require("../middlewares/authMiddleware");

router.post("/signUp", teacherSignUp);
router.post("/signIn", teacherSignIn);
router.get("/getTeachers", getAllTeachers);
router.get("/getTeacher/:id", authorizeToken, getTeacher);
router.delete("/deleteTeacher/:id", authorizeToken, deleteTeacher);

module.exports = router;
