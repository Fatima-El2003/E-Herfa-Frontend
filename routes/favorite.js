const express = require('express');
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const createConnection = require('../db');
const db = createConnection();

router.post('/insertFavorite', (req, res) => {
    const { courseId } = req.body;
  
    // Check if the course ID already exists in the database
    const checkSql = 'SELECT * FROM favorites WHERE id_course = ?';
    db.query(checkSql, [courseId], (checkErr, checkResults) => {
        if (checkErr) {
            console.error('Error checking course ID:', checkErr);
            res.status(500).json({ status: 500, message: 'Error checking course ID' });
        } else {
            // If the course ID does not exist in the database, insert it
            if (checkResults.length === 0) {
                const insertSql = 'INSERT INTO favorites (id_course) VALUES (?)';
                db.query(insertSql, [courseId], (insertErr, insertResults) => {
                    if (insertErr) {
                        console.error('Error inserting course ID:', insertErr);
                        res.status(500).json({ status: 500, message: 'Error inserting course ID' });
                    } else {
                        console.log('Course ID inserted successfully');
                        res.status(201).json({ status: 201, message: 'Course ID inserted successfully' });
                    }
                });
            } else {
                // Course ID already exists in the database, you can handle this case accordingly
                console.log('Course ID already exists in favorites');
                res.status(200).json({ status: 200, message: 'Course ID already exists in favorites' });
            }
        }
    });
  });
  //get favorite
router.get("/getfavorite", (req, res) => {
    try {
        db.query(
            "SELECT favorites.*, course.*, users.username, users.image AS userimage FROM favorites JOIN course ON favorites.id_course = course.id JOIN users ON users.id_user = course.id_teacher",
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