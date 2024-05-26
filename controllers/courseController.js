const {
  creatingTeacher,
  findCourse,
  CourseRemove,
} = require("../services/courseService");
const { findTeacherByID } = require("../services/teacherService");

const createCourse = async (req, res) => {
  try {
    const { teacher_id, course_name, course_code, description, course_type } =
      req.body;

    //    console.log(req.body);

    //finding teacher id
    const teacherFound = await findTeacherByID(teacher_id);

    if (teacherFound[0].length === 0) {
      return res.status(404).json({ error: "Respective teacher not found" });
    }
    // console.log(teacherFound);

    // Check if all required fields are provided
    if (!teacher_id || !course_name || !course_code) {
      return res.status(400).json({ error: "Add all fields" });
    }

    // Call the function to create the course
    const courseCreated = await creatingTeacher(
      teacher_id,
      course_name,
      course_code,
      description,
      course_type
    );

    console.log("created Course", courseCreated);

    // Check if the course was successfully created
    if (courseCreated && courseCreated.insertId) {
      // Respond with the details of the created course
      res.status(201).json({
        _id: courseCreated.insertId,
        course_name: course_name,
        course_code: course_code,
        description: description,
        course_type: course_type,
      });
    } else {
      // If there was an error creating the course, return an error response
      return res.status(500).json({ error: "Failed to create course" });
    }
  } catch (err) {
    // Handle any unexpected errors
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const [course] = await findCourse();

    res.json(course);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const [deletedCourse] = await CourseRemove(id);

    // Check if the student was found and deleted
    if (deletedCourse.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
};

module.exports = { createCourse, getCourse, deleteCourse };
