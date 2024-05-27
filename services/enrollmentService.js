const { pool } = require("../config/db");

const findEnrolledStudent = async (student_id, course_id) => {
  const [rows] = await pool.query(
    "SELECT * FROM enrollment WHERE student_id = ? AND course_id = ?",
    [student_id, course_id]
  );

  return [rows];
};

const creatingEnrollment = async (
  student_id,
  course_id,
  enrollment_date,
  enrollment_status
) => {
  const [rows] = await pool.query(
    "INSERT INTO enrollment (student_id, course_id, enrollment_date,enrollment_status) VALUES (?,?,?,?)",
    [student_id, course_id, enrollment_date, enrollment_status]
  );

  return rows;
};
const getEnrollmentDetails = async () => {
  try {
    const [rows] = await pool.query(`
        SELECT 
          e.id AS enrollment_id,
          e.enrollment_date,
          e.enrollment_status,
          
          s.id AS student_id,
          s.student_name,
          s.email AS student_email,
          s.address AS student_address,
          s.contact AS student_contact,
          s.role AS student_role,
  
          c.id AS course_id,
          c.course_name,
          c.course_code,
          c.description,
          c.course_type,
          
          t.teacher_name
          
        FROM 
          enrollment e
        JOIN 
          student s ON e.student_id = s.id
        JOIN 
          course c ON e.course_id = c.id
        JOIN 
          teacher t ON c.teacher_id = t.id;
      `);

    return rows;
  } catch (error) {
    console.error("Error fetching enrollment details:", error);
    throw error;
  }
};

const getCoursesByStudentId = async (studentId) => {
  try {
    const [rows] = await pool.query(
      `
        SELECT 
          c.id AS course_id,
          c.course_name,
          c.course_code,
          c.description,
          c.course_type
        FROM 
          enrollment e
        JOIN 
          course c ON e.course_id = c.id
        WHERE 
          e.student_id = ?;
      `,
      [studentId]
    );

    console.log(rows);

    return rows;
  } catch (error) {
    console.error("Error fetching courses for student:", error);
    throw error;
  }
};

const EnrollmentRemove = async (id) => {
  const [rows] = await pool.query("DELETE from enrollment where id = ?", [id]);

  return [rows];
};
// Export the function if you need to use it in other files

module.exports = {
  findEnrolledStudent,
  creatingEnrollment,
  getEnrollmentDetails,
  getCoursesByStudentId,
  EnrollmentRemove,
};
