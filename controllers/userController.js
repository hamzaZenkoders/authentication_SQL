const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const pool = require("../config/db");

const userSignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Checking if any fields are empty
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Add all fields" });
        }

        const checkUser = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        console.log("checkingggg user",checkUser);

        if (checkUser.rows && checkUser.rows.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

     
        const newUser = await pool.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) `, [name, email, hashedPassword]);
   

        if (newUser.rows && newUser.rows.length > 0) {
            // Accessing the inserted user's data
            const { id, username, email } = newUser.rows[0];
            return res.status(201).json({
                _id: id,
                name: username,
                email: email,
            });
        } else {
            return res.status(400).json({ error: "Invalid user data" });
        }
    } catch (err) {
        const status = err.status || 500;
        return res.status(status).json({ error: err.message });
    }
}

module.exports = { userSignUp };
