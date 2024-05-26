const { pool } = require("../config/db");
const {
  teacherSignUpService,
  teacherSignInService,
  getAllTeachersService,
  findTeacherByID,
  deleteTeacherByID,
  generateJWT,
} = require("../services/teacherService");

require("dotenv").config();

const teacherSignUp = async (req, res) => {
  try {
    const { name, position, email, address, contact, role, password } =
      req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const newTeacher = await teacherSignUpService(
      name,
      position,
      email,
      address,
      contact,
      role,
      password
    );

    if (newTeacher && newTeacher[0].insertId) {
      return res.status(201).json({
        _id: newTeacher.insertId,
        name: name,
        position: position,
        email: email,
        address: address,
        contact: contact,
        role: role,
        token: await generateJWT(newTeacher.insertId),
      });
    } else {
      return res.status(500).json({ error: "Failed to create Teacher" });
    }
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
};

const teacherSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Add all fields" });
    }

    const teacherSignedIn = await teacherSignInService(email, password);

    //console.log(teacherSignedIn);

    res.json({
      _id: teacherSignedIn[0].id,
      position: teacherSignedIn[0].position,
      email: teacherSignedIn[0].email,
      address: teacherSignedIn[0].address,
      contact: teacherSignedIn[0].contact,
      role: teacherSignedIn[0].role,
      token: await generateJWT(teacherSignedIn[0].id, teacherSignedIn[0].role),
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ "controller error": err.message });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const [teachers] = await getAllTeachersService();

    if (teachers.length > 0) {
      res.status(200).json(teachers);
    } else {
      throw new Error("No students data found");
    }
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
};

const getTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await findTeacherByID(id);
    const teacherData = rows[0];

    if (!teacherData) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacherData);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await deleteTeacherByID(id);

    console.log(result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
};

module.exports = {
  teacherSignUp,
  teacherSignIn,
  getAllTeachers,
  getTeacher,
  deleteTeacher,
};
