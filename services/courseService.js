const { pool } = require("../config/db");

const creatingTeacher = async (
  teacher_id,
  course_name,
  course_code,
  description,
  course_type
) => {
  const [rows] = await pool.query(
    "INSERT INTO course (teacher_id, course_name, course_code, description, course_type) VALUES (?,?,?,?,?)",
    [teacher_id, course_name, course_code, description, course_type]
  );

  return rows;
};

const findCourse = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id AS course_id,
        c.course_name,
        c.course_code,
        c.description,
        c.course_type,
        t.id AS teacher_id,
        t.teacher_name,
        t.position,
        t.email,
        t.address,
        t.contact,
        t.role
      FROM 
        course c
      INNER JOIN 
        teacher t ON c.teacher_id = t.id;
    `);

    return [rows];
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching course details");
  }
};

const CourseRemove = async (id) => {
  const [rows] = await pool.query("DELETE from course where id = ?", [id]);

  return [rows];
};

module.exports = { creatingTeacher, findCourse, CourseRemove };
