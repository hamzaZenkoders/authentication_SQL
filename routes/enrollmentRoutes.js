const express = require("express");
const {
  authorizeRoles,
  authorizeToken,
} = require("../middlewares/authMiddleware");
const {
  createEnrollment,
  getEnrollment,
  deleteEnrollment,
  enrollmentAllCourses,
} = require("../controllers/enrollmentController");

const router = express.Router();

// Use authorizeRoles as middleware for the "teacher" role

//create
router.post(
  "/createEnrollment",
  authorizeToken,
  authorizeRoles(["student"]),
  createEnrollment
);

//get
router.get(
  "/getEnrollmentDetailss",
  authorizeRoles(["student", "teacher"]),
  getEnrollment
);

//delete

router.delete(
  "/deleteEnrollment/:id",
  authorizeRoles(["teacher"]),
  deleteEnrollment
);

//all enrolled courses of a student
router.get(
  "/allEnrolledCourses/:studentId",
  authorizeToken,
  authorizeRoles(["student"]),
  enrollmentAllCourses
);

module.exports = router;
