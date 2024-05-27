const {
  findEnrolledStudent,
  creatingEnrollment,
  getEnrollmentDetails,
  EnrollmentRemove,
  getCoursesByStudentId,
} = require("../services/enrollmentService");

const createEnrollment = async (req, res) => {
  try {
    const { student_id, course_id, enrollment_date, enrollment_status } =
      req.body;

    const [rows] = await findEnrolledStudent(student_id, course_id);

    if (rows.length > 0) {
      throw new Error("Student is already enrolled");
    }

    const enrollmentCreated = await creatingEnrollment(
      student_id,
      course_id,
      enrollment_date,
      enrollment_status
    );

    if (enrollmentCreated && enrollmentCreated.insertId) {
      res.status(201).json({
        _id: enrollmentCreated.insertId,
        student_id: student_id,
        course_id: course_id,
        enrollment_date: enrollment_date,
        enrollment_status: enrollment_status,
      });
    } else {
      return res.status(500).json({ error: "Failed to create enrollment" });
    }
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
};

const getEnrollment = async (req, res) => {
  try {
    const [course] = await getEnrollmentDetails();

    console.log(course);
    res.json(course);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
};

const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    const [deletedEnrollment] = await EnrollmentRemove(id);

    // Check if the student was found and deleted
    if (deletedEnrollment.affectedRows === 0) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    res.json({ message: "Enrollment deleted successfully" });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
};

const enrollmentAllCourses = async (req, res) => {
  const { studentId } = req.params;

  try {
    const courses = await getCoursesByStudentId(studentId);

    console.log("sdasdasda", courses);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses for student" });
  }
};

module.exports = {
  createEnrollment,
  getEnrollment,
  deleteEnrollment,
  enrollmentAllCourses,
};
