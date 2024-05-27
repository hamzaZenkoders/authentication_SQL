const { pool } = require("../config/db");
const {
  studentSignUpFn,
  studentSignInFn,
  findStudentByID,
  findAllStudents,
  deleteStudent,
  generateJWT,
  updatingStudentData,
} = require("../services/studentService");
require("dotenv").config();

const studentSignUp = async (req, res) => {
  try {
    const { name, email, address, contact, role, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Add all fields" });
    }

    const signedUpStudent = await studentSignUpFn(
      name,
      email,
      address,
      contact,
      role,
      password
    );

    //console.log(signedUpStudent);

    res.status(201).json({
      _id: signedUpStudent.insertId,
      name: name,
      email: email,
      address: address,
      contact: contact,
      role: role,
      token: await generateJWT(signedUpStudent.insertId),
    });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).send(err.message);
  }
};

const studentSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const studentSignedIn = await studentSignInFn(email, password);

    console.log(studentSignIn);

    res.json({
      _id: studentSignedIn[0].id,
      name: studentSignedIn[0].name,
      email: studentSignedIn[0].email,
      adress: studentSignedIn[0].address,
      contact: studentSignedIn[0].contact,
      role: studentSignedIn[0].role,
      token: await generateJWT(studentSignedIn[0].id, studentSignedIn[0].role),
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
};

const fetchStudentData = async (req, res) => {
  try {
    const { id } = req.params;

    // console.log("emtering controller");

    const [rows] = await findStudentByID(id);

    //  console.log("rows student data :", rows);

    const studentData = rows[0];

    if (!studentData) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(studentData);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).send("Controller Error: " + err.message);
  }
};

const updateStudentData = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const [rows] = await findStudentByID(id);
    // console.log("Existing student data:", rows);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Merge the existing data with the new data
    const existingData = rows[0];
    const updatedData = { ...existingData, ...data };

    // Prepare the fields to be updated
    const { student_name, email, address, contact, role, password } =
      updatedData;

    console.log("updatedData", updatedData);

    // Update the student data in the database
    const modifiedStudentData = await updatingStudentData(
      id,
      student_name,
      email,
      address,
      contact,
      role,
      password
    );

    if (modifiedStudentData.affectedRows > 0) {
      res.status(200).json(updatedData);
    } else {
      throw new Error("Unable to update the data");
    }

    // Respond with the updated student data
  } catch (err) {
    const status = err.status || 500;
    res.status(status).send("Controller Error: " + err.message);
  }
};

const deleteStudentData = async (req, res) => {
  try {
    const { id } = req.params;

    // Construct and execute the delete query
    const [result] = await deleteStudent(id);

    console.log(result);
    // Check if the student was found and deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).send("Controller Error: " + err.message);
  }
};

const fetchAllStudentsData = async (req, res) => {
  try {
    const [rows] = await findAllStudents();

    if (!rows) {
      throw new Error("No students data found");
    }

    res.json(rows);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
};

module.exports = {
  studentSignUp,
  studentSignIn,
  fetchStudentData,
  updateStudentData,
  fetchAllStudentsData,
  deleteStudentData,
};
