/* const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                token = req.headers.authorization.split(" ")[1];

                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // Retrieve user from the database
                const [rows, fields] = await pool.query(`SELECT * FROM users WHERE id = ?`, [decoded.id]);
                
                if (rows.length > 0) {
                    // Set the user data in the request object
                    req.user = rows[0];
                    next();
                } else {
                    res.status(401);
                    throw new Error("User not found");
                }
            } catch (err) {
                res.status(401);
                throw new Error("Not authorized");
            }
        } else {
            res.status(401);
            throw new Error('Not authorized, No token');
        }
    } catch (err) {
        const status = err.status || 500;
        return res.status(status).json({ error: err.message });
    }
}

module.exports = { protect };
 */

const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

/* const protect =(allowedRoles)=> async (req, res, next) => {
    try {
        let token;

        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
            throw new Error('Not authorized: No token provided');
        }

        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [rows, fields] = await pool.query('SELECT * FROM student WHERE id = ?', [decoded.id]);

        if (rows.length === 0) {
            throw new Error('Student not found');
        }
        console.log("allowed roles",allowedRoles);
        console.log("roles",decoded);

        if (!allowedRoles.includes(decoded.role)) {
            return res.status(403).json({ error: 'Forbidden' });
          }

        req.user = rows[0];
        next();
    } catch (err) {
        const status = err.status || 401;
        res.status(status).json({ error: err.message });
    }
} */

const authorizeStudent = (allowedRoles) => async (req, res, next) => {
    try {
      let token;
  
      if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        throw new Error('Not authorized: No token provided');
      }
  
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const [rows, fields] = await pool.query('SELECT * FROM student WHERE id = ?', [decoded.id]);
  
      if (rows.length === 0) {
        throw new Error('Student not found');
      }
      console.log("decoded:", decoded);
      console.log("allowed roles", allowedRoles);
      console.log("roles", decoded.role);
  
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
  
      req.user = rows[0];
      next();
    } catch (err) {
      const status = err.status || 401;
      res.status(status).json({ error: err.message });
    }
  }
  

module.exports = { authorizeStudent };
