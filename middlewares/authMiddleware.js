const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const authorizeToken = async (req, res, next) => {
  try {
    let token;

    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      throw new Error("Not authorized: No token provided");
    }

    token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    console.log("middleware checking ", decoded);

    next();
  } catch (err) {
    const status = err.status || 401;
    res.status(status).json({ error: err.message });
  }
};

const authorizeRoles = (allowedRoles) => async (req, res, next) => {
  try {
    const { role } = req.body;

    console.log(req.body);

    /* if (req.params.id && parseInt(req.params.id) !== id) {
      return res.status(403).json({ error: "Forbidden: ID mismatch" });
    } */
    console.log("allowedRoles", allowedRoles);
    console.log("Roles", role);

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    // req.userDetails = rows[0]; // Attach user details to the request object

    next();
  } catch (err) {
    const status = err.status || 403;
    res.status(status).send("Middleware Error: " + err.message);
  }
};
/* 
const authorizeTeacher = (allowedRoles) => async (req, res, next) => {
  try {
    let token;

    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      throw new Error("Not authorized: No token provided");
    }

    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("middleware checking ", decoded);

    /* //checking if provided token is similar to the reqeusted id
      if (req.params.id && decoded.id !== parseInt(req.params.id)) {
          return res.status(403).json({ error: 'Forbidden: ID mismatch' });
        } 

    const [rows] = await pool.query("SELECT * FROM teacher WHERE id = ?", [
      decoded.id,
    ]);

    if (rows.length === 0) {
      throw new Error("teacher not found");
    }

    if (!allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    const status = err.status || 401;
    res.status(status).json({ error: err.message });
  }
}; */

module.exports = { authorizeToken, authorizeRoles };
