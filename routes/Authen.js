const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const createConnection = require('../db'); // Import your database connection pool and secretKey
const { validateToken } = require("../middlewares/AuthMiddleware");
const secretKey = 'your-secret-key';
const db = createConnection();
// Registration
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;
  const role = "artisan";
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, password, username, role) VALUES (?, ?, ?, ?)';
    
    db.query(query, [email, hashedPassword, username, role], (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Registration failed' });
        return;
      }
      
      res.status(200).json({ message: 'Registration successful' });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * FROM users WHERE email = ?;", email, (err, result) => {
    if (err) {
      res.send({ err: err });
      return
    }

    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          const { id_user, role } = result[0];
          const accessToken = jwt.sign({ id: id_user, role }, secretKey, { expiresIn: '300d' });
          res.json({ auth: true, user: result[0], accessToken });
        } else {
          res.json({ auth: false, message: 'Wrong username/password combination!' });
        }
      });
    } else {
      res.json({ auth: false, message: "User doesn't exist" });
    }
  });
});

module.exports = router;
