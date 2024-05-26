const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { pool } = require("../config/db");

//student sign up service

const studentSignUpFn = async (
  name,
  email,
  address,
  contact,
  role,
  password
) => {
  try {
    const [rows] = await findStudentByEmail(email);

    if (rows.length > 0) {
      throw new Error("Student already exists");
    } else {
      const hashedPassword = await hashingPassword(password);

      const [newStudent] = await pool.query(
        `INSERT INTO student (student_name, email, address, contact, role, password) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, address, contact, role, hashedPassword]
      );

      if (newStudent && newStudent.insertId) {
        return newStudent;
      } else {
        throw new Error("Failed to create user");
      }
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

//student signin service

const studentSignInFn = async (email, password) => {
  try {
    const [student] = await findStudentByEmail(email);

    if (
      student.length > 0 &&
      (await bcrypt.compare(password, student[0].password))
    ) {
      return student;
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

//hashed password function

const hashingPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

//generate JWT function

const generateJWT = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

//finding student by email

const findStudentByEmail = async (email) => {
  const [student] = await pool.query(`SELECT * FROM student WHERE email = ? `, [
    email,
  ]);
  return [student];
};

//finding student by id
const findStudentByID = async (id) => {
  const [student] = await pool.query(`SELECT * FROM student WHERE id = ? `, [
    id,
  ]);
  return [student];
};

//find all students
const findAllStudents = async () => {
  const [rows] = await pool.query("SELECT * FROM student");
  return [rows];
};

//delete student

const deleteStudent = async (id) => {
  const [rows] = await pool.query("DELETE from student where id = ?", [id]);
  return [rows];
};

module.exports = {
  studentSignUpFn,
  studentSignInFn,
  findStudentByID,
  findAllStudents,
  deleteStudent,
  generateJWT,
};
