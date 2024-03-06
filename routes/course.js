const express = require('express');
const router = express.Router();
const multer = require("multer");
const { validateToken } = require("../middlewares/AuthMiddleware");
const createConnection = require('../db');
const db = createConnection();


router.use("/uploads",express.static("../uploads"))
var imgconfig = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./uploads");
    },
    filename:(req,file,callback)=>{
      callback(null,`image-${Date.now()}.${file.originalname}`)
  }
  });
  var upload = multer({
    storage:imgconfig,
  })

  router.post('/addcourse', validateToken, upload.single('photo'), (req, res) => {
    const { name, category, chapter_number, difficulty, description } = req.body;
    const id_teacher = req.user.id;
    const created_at = new Date(); // Get the current date and time
    const image = req.file.filename;
    
    const courseQuery = 'INSERT INTO course (name, category, lessons_number, difficulty, description, id_teacher, image, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(courseQuery, [name, category, chapter_number, difficulty, description, id_teacher, image, created_at], (courseErr, courseResult) => {
      if (courseErr) {
        console.error('Error inserting course details: ', courseErr);
        res.status(500).json({ status: 500, message: 'Error inserting course details' });
      } else {
        // Insert chapter details into the database (loop through chaptersArray)
        const chaptersArray = JSON.parse(req.body.chaptersArray);
        const chapterQuery = 'INSERT INTO chapters (id_course, name, video) VALUES (?, ?, ?)';
  
        const insertChapter = (index) => {
          if (index === chaptersArray.length) {
            // All chapters inserted successfully
            res.status(201).json({ status: 201, message: 'Course and chapters added successfully' });
            return;
          }
  
          const chapter = chaptersArray[index];
          db.query(chapterQuery, [courseResult.insertId, chapter.name, chapter.video], (chapterErr) => {
            if (chapterErr) {
              console.error('Error inserting chapter details: ', chapterErr);
              res.status(500).json({ status: 500, message: 'Error inserting chapter details' });
            } else {
              // Continue to insert the next chapter
              insertChapter(index + 1);
            }
          });
        };
  
        insertChapter(0); // Start inserting chapters from index 0
      }
    });
  });
  

router.get("/getcourse",(req,res)=>{
    try {
        db.query("SELECT course.*, users.username AS username, users.image AS userimage FROM course JOIN users ON course.id_teacher = users.id_user",(err,result)=>{
            if(err){
                console.error("error",err)
            }else{
                console.log("data get")
                res.status(201).json({status:201,data:result})
            }
        })
    } catch (error) {
        res.status(422).json({status:422,error})
    }
  });

router.get("/getcoursebyid",validateToken, (req, res) => {
  
    try {
      const teacherId = req.user.id; 
  
      db.query("SELECT * FROM course WHERE id_teacher = ?", teacherId, (err, result) => {
        if(err){
          console.log("error")
      }else{
          console.log("data get")
          res.status(201).json({status:201,data:result})
      }
  })
  } catch (error) {
      res.status(302).json({ status: 302, error });
    }
  });
  
router.get("/getcoursedetails/:id", (req, res) => {
    try {
      const courseId = req.params.id;
      db.query(
        "SELECT course.*, users.username AS username FROM course INNER JOIN users ON course.id_teacher = users.id_user WHERE course.id = ?",
        courseId,
        (err, result) => {
          if(err){
            console.log("error")
        }else{
            console.log("data get")
            res.status(201).json({status:201,data:result})
        }
    })
    } catch (error) {
        res.status(302).json({ status: 302, error });
      }
    })
//delete course
router.delete("/deletecourse/:id", (req,res) => {
    const id = req.params.id;
    db.query("DELETE FROM course WHERE id = ?", id, (err,result) => {
      if(err){
        console.log(err);
      } else {
        res.send(result);
      }
    })
  })
  //upd tecourse
router.get("/updatecoursebyid/:id", (req, res) => {
    
    try {
      const teacherId = req.params.id; 
  
      db.query("SELECT * FROM course WHERE id_teacher = ?", teacherId, (err, result) => {
        if(err){
          console.log("error")
      }else{
          console.log("result get");
          return res.json(result);
      }
  })
  } catch (error) {
      res.status(422).json({ status: 422, error });
    }
  });
  
  //updatecourse
  
router.put('/updatecourse/:id',upload.single("photo"), (req, res) => {
    // Retrieve course information from req.body
    const { id } = req.params;
    const { name, category, description, difficulty, chapter_number } = req.body;
  
    // Insert course details into the database
    const courseQuery = `
    UPDATE course
    SET
      name = ?,
      category = ?,
      description = ?,
      difficulty = ?,
      lessons_number = ?,
      image = ?
    WHERE
      id = ?
  `;
    db.query(courseQuery, [name, category, description, difficulty, chapter_number, req.file.filename, id], (courseErr, courseResult) => {
      if (courseErr) {
        console.error('Error inserting course details: ', courseErr);
        res.status(500).json({ status: 500, message: 'Error inserting course details' });
      } else {
        // Insert chapter details into the database (loop through chaptersArray)
        const chaptersArray = JSON.parse(req.body.chaptersArray);
        const chapterQuery = `
        UPDATE chapters
        SET
          name = ?,
          video = ?
        WHERE
          id = ?
      `;
  
        const insertChapter = (index) => {
          if (index === chaptersArray.length) {
            // All chapters inserted successfully
            res.status(201).json({ status: 201, message: 'Course and chapters added successfully' });
            return;
          }
  
          const chapter = chaptersArray[index];
          db.query(chapterQuery, [chapter.name, chapter.video, id], (chapterErr) => {
            if (chapterErr) {
              console.error('Error inserting chapter details: ', chapterErr);
              res.status(500).json({ status: 500, message: 'Error inserting chapter details' });
            } else {
              // Continue to insert the next chapter
              insertChapter(index + 1);
            }
          });
        };
  
        insertChapter(0); // Start inserting chapters from index 0
      }
    });
  });
  module.exports = router