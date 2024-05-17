const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//const connection = require("../config/db");
const { pool} = require("../config/db");
require('dotenv').config();


const teacherSignUp = async (req, res) => {
    try {
      const { name,position, email, address, contact, role, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Please provide all required fields" });
      }
  

      const [rows, fields] = await pool.query('SELECT * FROM teacher WHERE email = ?', [email]);
      if (rows.length > 0) {
        return res.status(400).json({ error: "Teacher already exists" });
      }
  
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
       

      const newTeacher = await pool.query(
        'INSERT INTO teacher (teacher_name, position, email, address, contact, role, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, position, email, address, contact, role, hashedPassword]
      );
      
      if (newTeacher && newTeacher.insertId) {
        return res.status(201).json({
          _id: newTeacher.insertId,
          name: name,
          position:position,
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

  
const generateJWT  = async (id,role) =>{
    return jwt.sign({id,role},process.env.JWT_SECRET,{
      expiresIn:'2d',
    })
  }
  
  module.exports = { teacherSignUp };
  