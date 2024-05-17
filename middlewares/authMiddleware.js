const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const authorizeStudent = (allowedRoles) => async (req, res, next) => {
  try {
    let token;

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
      throw new Error('Not authorized: No token provided');
    }

    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("middleware checking ",decoded);

    //checking if provided token is similar to the reqeusted id
    if (req.params.id && decoded.id !== parseInt(req.params.id)) {
        return res.status(403).json({ error: 'Forbidden: ID mismatch' });
      }

    const [rows] = await pool.query('SELECT * FROM student WHERE id = ?', [decoded.id]);

    if (rows.length === 0) {
      throw new Error('Student not found');
    }

    if (!allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    const status = err.status || 401;
    res.status(status).json({ error: err.message });
  }
}

const authorizeTeacher = (allowedRoles) => async (req, res, next) => {
    try {
      let token;
  
      if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        throw new Error('Not authorized: No token provided');
      }
  
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      console.log("middleware checking ",decoded);
  
      /* //checking if provided token is similar to the reqeusted id
      if (req.params.id && decoded.id !== parseInt(req.params.id)) {
          return res.status(403).json({ error: 'Forbidden: ID mismatch' });
        } */
  
      const [rows] = await pool.query('SELECT * FROM teacher WHERE id = ?', [decoded.id]);
  
      if (rows.length === 0) {
        throw new Error('teacher not found');
      }
  
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient role' });
      }
  
      req.user = rows[0];
      next();
    } catch (err) {
      const status = err.status || 401;
      res.status(status).json({ error: err.message });
    }
  }
  

module.exports = { authorizeStudent };
