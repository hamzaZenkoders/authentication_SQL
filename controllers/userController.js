const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//const connection = require("../config/db");
const { pool} = require("../config/db");

const userSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    // Checking if any fields are empty
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Add all fields" });
    }

    console.log("emailll",email);

     //check if user exists
      const [rows,fields] = await pool.query(
     `SELECT * FROM users WHERE email = ? `,
       [email]
      );
      console.log("rows",rows);

      if(rows.length >0){
        res.status(400);
        throw new Error("User already exists");
      }else{


    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   const newUser = await pool.query(
    `INSERT INTO users (username, email, password) VALUES (?, ?, ?) `,
    [name, email, hashedPassword]);

 
  // const newUserResponse = newUser[0]; 
   //console.log("newUsr Response::: ",newUserResponse );

    if (newUser && newUser[0].insertId) {
      
      res.status(201).json({
        _id: newUser[0].insertId, 
        name: name, 
        email: email, 
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
      `SELECT * FROM users WHERE email = ? `,
        [email]
       );
  
       console.log(rows);
  
       if(rows.length>0 && (await bcrypt.compare(password,rows[0].password))){
        res.json({  
          _id:rows[0].id,
          name:rows[0].name,
          email:rows[0].email,
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

module.exports = { userSignUp,userSignIn };
