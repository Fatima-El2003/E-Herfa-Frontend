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

router.get("/getachievement",(req,res)=>{
    const db = createConnection();
    try {
        db.query("SELECT achievement.* ,users.username, users.image AS userimage FROM achievement JOIN users ON achievement.id_user = users.id_user",(err,result)=>{
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

router.post('/addachievement', validateToken, upload.single('photo'), (req, res) => {
    const { name, category, course } = req.body;
    const { filename } = req.file;
    const id = req.user.id
    const created_at = new Date();
    const query = 'INSERT INTO achievement (id_user, name, category, course, image, date) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [id, name, category, course, filename, created_at], (err, result) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
      } else {
        console.log('Data added successfully');
        res.status(201).json({ status: 201, message: 'Data added successfully' });
      }
    });
  });
router.get("/getachievementdetails/:id", (req, res) => {
    const achievementId = req.params.id;
    db.query(
      `SELECT achievement.name, achievement.category, achievement.course, achievement.image, achievement.name, users.username, users.image AS userimage FROM achievement JOIN users ON achievement.id_user = users.id_user WHERE achievement.id = ?;`,
      achievementId,
      (err, result) => {
        if (err) {
          console.error('Error:', err);
          res.status(500).json({ status: 500, error: 'Internal Server Error' });
        } else {
          if (result.length === 0) {
            // Achievement not found
            res.status(404).json({ status: 404, error: 'Achievement not found' });
          } else {
            // Achievement found, send the result
            console.log('Data retrieved successfully');
            res.status(200).json({ status: 200, data: result });
          }
        }
      }
    );
  });
router.post('/likeAchievement', (req, res) => {
    const { achievementId } = req.body;
  
    if (!achievementId) {
      return res.status(400).json({ status: 400, message: 'Invalid request' });
    }
  
    // Increment the like_total in the achievement table
    const updateQuery = 'UPDATE achievement SET like_total = like_total + 1 WHERE id = ?';
    db.query(updateQuery, [achievementId], (updateErr, updateResults) => {
      if (updateErr) {
        return res.status(500).json({ status: 500, message: 'Failed to update like_total' });
      }
  
      res.status(200).json({ status: 200, message: 'Achievement liked successfully' });
    });
  });
  
  //get ach likes
router.get('/getTotalLikes/:achievementId', (req, res) => {
    const achievementId = req.params.achievementId;
  
    if (!achievementId) {
      return res.status(400).json({ status: 400, message: 'Invalid request' });
    }
  
    // Query the database to get the total likes for the specified achievement
    const query = 'SELECT like_total FROM achievement WHERE id = ?';
    db.query(query, [achievementId], (err, results) => {
      if (err) {
        return res.status(500).json({ status: 500, message: 'Failed to fetch total likes' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ status: 404, message: 'Achievement not found' });
      }
  
      const totalLikes = results[0].like_total;
  
      res.status(200).json({ status: 200, totalLikes });
    });
  });
  
  //achievement comment
router.get('/achievments/comments/:id', (req, res) => {
    const id = req.params.id;
    db.query(`SELECT commentachievement.text, commentachievement.date, users.username,users.image AS userimage FROM commentachievement JOIN users ON commentachievement.id_user = users.id_user WHERE id_achievement = ? `, [id], (err, results) => {
      if (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ error: 'Error fetching comments' });
      } else {
        res.json({ comments: results });
      }
    });
  });
  
router.post('/achievments/comments', validateToken, (req, res) => {
    const { text, achievementId, date } = req.body;
    const user = req.user.id;
    if (text && user && date) {
      db.query(
        'INSERT INTO commentachievement (text, id_achievement, id_user, date) VALUES (?, ?, ?, ?)',
        [text, achievementId, user, date],
        (err, result) => {
          if (err) {
            console.error('Error adding comment:', err);
            res.status(500).json({ error: 'Error adding comment' });
          } else {
            res.status(201).json({ message: 'Comment added successfully' });
          }
        }
      );
    } else {
      res.status(400).json({ error: 'Comment text, user, and date are required' });
    }
  });
  module.exports = router