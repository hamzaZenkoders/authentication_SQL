const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { pool } = require("../config/db");

const teacherSignUpService = async (
  name,
  position,
  email,
  address,
  contact,
  role,
  password
) => {
  try {
    const [rows] = await findTeacherByEmail(email);

    if (rows.length > 0) {
      throw new Error("Teacher already exists");
    } else {
      const hashedPassword = await hashingPassword(password);

      const newTeacher = await pool.query(
        "INSERT INTO teacher (teacher_name, position, email, address, contact, role, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, position, email, address, contact, role, hashedPassword]
      );

      //console.log(newTeacher);

      if (newTeacher && newTeacher[0].insertId) {
        return newTeacher;
      } else {
        throw new Error("Failed to create user");
      }
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

//teacher signin service

const teacherSignInService = async (email, password) => {
  try {
    const [teacher] = await findTeacherByEmail(email);

    console.log(teacher);
    if (
      teacher.length > 0 &&
      (await bcrypt.compare(password, teacher[0].password))
    ) {
      return teacher;
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

//find teacher by email

const findTeacherByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM teacher WHERE email = ?", [
    email,
  ]);

  return [rows];
};

//find teacher by id

const findTeacherByID = async (email) => {
  const [rows] = await pool.query("SELECT * FROM teacher WHERE id = ?", [
    email,
  ]);

  return [rows];
};

//delete teacher

const deleteTeacherByID = async (id) => {
  const [result] = await pool.query("DELETE from teacher where id = ?", [id]);
  return [result];
};

//get all teachers

const getAllTeachersService = async () => {
  const [rows] = await pool.query("SELECT * from teacher");
  return [rows];
};

const updatingTeacherData = async (
  id,
  name,
  position,
  email,
  address,
  contact,
  role,
  password
) => {
  const [rows] = await pool.query(
    `UPDATE teacher
     SET name = ?,position= ?, email = ?, address = ?, contact = ?, role = ?, password = ? 
     WHERE id = ?`,
    [name, position, email, address, contact, role, password, id]
  );

  return rows;
};

//generate JWT function

const generateJWT = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

module.exports = {
  teacherSignUpService,
  getAllTeachersService,
  updatingTeacherData,
  teacherSignInService,
  findTeacherByID,
  deleteTeacherByID,
  generateJWT,
};
