const express = require('express');
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const createConnection = require('../db');
const db = createConnection();


//check started
router.get('/check-course-started',validateToken, (req, res) => {
    const { course_id } = req.query;
    const id = req.user.id;
    // Query the database to check if there is a progress record for the user and course
    const sql = 'SELECT * FROM progress WHERE id_user = ? AND id_course = ?';
    db.query(sql, [id, course_id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error checking course progress' });
        return;
      }
  
      if (result.length > 0) {
        // If a record exists, the user has started the course
        res.json({ started: true });
      } else {
        // If no record exists, the user has not started the course
        res.json({ started: false });
      }
    });
  });
  //insert a record
router.post('/start-course', validateToken, (req, res) => {
    const { course_id } = req.body;
    const id = req.user.id;
    const currentDate = new Date();
    // Create a new progress record with started set to true
    const createSql = 'INSERT INTO progress (id_user, id_course, started, start_date) VALUES (?, ?, ?, ?)';
    db.query(createSql, [id, course_id, true, currentDate], (createErr, createResult) => {
      if (createErr) {
        res.status(500).json({ error: 'Error starting the course' });
        return;
      }
      res.json({ message: 'Course started successfully' });
    });
  });
  
router.get('/get-started-courses', validateToken, (req, res) => {
    const id = req.user.id;
    // Query the database to get started lessons for the user
    const sql = 'SELECT progress.id_course, course.name, course.image, progress.start_date FROM progress JOIN course ON progress.id_course = course.id WHERE progress.id_user = ?';
    
    db.query(sql, [id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching started lessons' });
        return;
      }
  
      // Send the list of started lessons as a response
      res.status(200).json({ status: 200, data: result });
    });
  });

  router.get("/user-name", validateToken, (req, res) => {
    const id = req.user.id;
    try {
        db.query(
            "SELECT username FROM users WHERE id_user = ?",[id],
            (err, results) => {
                if (err) {
                    console.log("Error:", err);
                    res.status(500).json({ status: 500, error: "Error fetching data" });
                } else {
                    console.log("Data fetched successfully");
                    res.status(201).json({ status: 201, data: results });
                }
            }
        );
    } catch (error) {
        console.log("Error:", error);
        res.status(422).json({ status: 422, error });
    }
  });
  module.exports = router