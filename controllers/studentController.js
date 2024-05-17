const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//const connection = require("../config/db");
const { pool} = require("../config/db");
require('dotenv').config();


const studentSignUp = async (req, res) => {
  try {
    const { name, email, address, contact, role,password } = req.body;
    //address, contact, role, hashedPassword
    

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Add all fields" });
    }

    console.log("emailll",email);

     //check if user exists
      const [rows,fields] = await pool.query(
     `SELECT * FROM student WHERE email = ? `,
       [email]
      );
      console.log("rows",rows);

      if(rows.length >0){
        res.status(400);
        throw new Error("Student already exists");
      }else{


    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = await pool.query(
      `INSERT INTO student (student_name, email, address, contact, role, password) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, address, contact, role, hashedPassword]
  );
  

    if (newStudent && newStudent[0].insertId) {
      
      res.status(201).json({
        _id: newStudent[0].insertId, 
        name: name, 
        email: email, 
        address: address,
        contact:contact,
        role:role,
        token: await generateJWT(newStudent[0].insertId),
      });
    } else {
      // If there was an error inserting the user, return an error
      return res.status(500).json({ error: "Failed to create user" });
    }
  }
    

  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
};

const userSignIn = async(req,res)=>{
  try{
    const { email, password } = req.body;

    const [rows,fields] = await pool.query(
      `SELECT * FROM student WHERE email = ? `,
        [email]
       );
  
       console.log("rowss controller",rows);
       console.log("idddd",rows[0].id);
      // console.log("ows roles",rows[0].roles);
  
       if(rows.length>0 && (await bcrypt.compare(password,rows[0].password))){
        res.json({  
          _id:rows[0].id,
          name:rows[0].name,
          email:rows[0].email,
          address: rows[0].address,
          contact:rows[0].contact,
          role:rows[0].role,
          token: await generateJWT(rows[0].id,rows[0].role),
        })
       }else{
        res.status(400);
        throw new Error("Invalid credentials");
       }
  }
  catch(err){
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
 
}
const fetchStudentData = async (req, res) => {
  try {
    const { id } = req.params;
   
    const [rows] = await pool.query("SELECT * FROM student WHERE id = ?", [id]);
    console.log("rows student data :",rows);
    const studentData = rows[0]; // Assuming the query returns an array of results

    if (!studentData) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(studentData);

  } catch (err) {
    const status = err.status || 500;
    res.status(status).send('Controller Error: ' + err.message);
  }
};

const updateStudentData = async (req,res) =>{
  try {
    const { id } = req.params;
    const {} = req.body;
   
    const [rows] = await pool.query("SELECT * FROM student WHERE id = ?", [id]);
    console.log("rows student data :",rows);
    const studentData = rows[0]; // Assuming the query returns an array of results

    if (!studentData) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(studentData);

  } catch (err) {
    const status = err.status || 500;
    res.status(status).send('Controller Error: ' + err.message);
  }
}

const deleteStudentData = async (req, res) => {
  try {
    const { id } = req.params;

    // Construct and execute the delete query
    const [result] = await pool.query('DELETE FROM student WHERE id = ?', [id]);

    // Check if the student was found and deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).send('Controller Error: ' + err.message);
  }
};



const test = async (req, res) => {
  try {
    console.log("test controller", req.user);

    const [rows, fields] = await pool.query(`SELECT * FROM users WHERE id = ?`, [req.user.id]);

    console.log("Rowssss",rows[0]);
    const { id, username, email } = rows[0]; 


    res.status(200).json({
      id,
      username,
      email,
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
}


const generateJWT  = async (id,role) =>{
  return jwt.sign({id,role},process.env.JWT_SECRET,{
    expiresIn:'2d',
  })
}

module.exports = { studentSignUp,userSignIn,test,fetchStudentData,updateStudentData,deleteStudentData };
