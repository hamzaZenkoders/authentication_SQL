const express = require("express");
const {
  createCourse,
  getCourse,
  deleteCourse,
} = require("../controllers/courseController");
const {
  authorizeRoles,
  authorizeToken,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Use authorizeRoles as middleware for the "teacher" role
router.post("/createCourse", authorizeRoles(["teacher"]), createCourse); //create
router.get("/getCourses", authorizeRoles(["student"]), getCourse); //get
router.delete("/deleteCourse/:id", authorizeRoles(["teacher"]), deleteCourse); //delete
module.exports = router;
