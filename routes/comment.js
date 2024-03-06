const express = require('express');
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const createConnection = require('../db');
const db = createConnection();


//check started
router.get('/comments/:id', (req, res) => {
    chapterId = req.params.id;
    db.query(`SELECT comments.text, comments.likedStatus, comments.date, users.username FROM comments JOIN users ON comments.id_user = users.id_user WHERE id_chapter=? `, [chapterId] ,(err, results) => {
      if (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ error: 'Error fetching comments' });
      } else {
        res.json({ comments: results });
      }
    });
  });
  
router.post('/comments/:id', validateToken, (req, res) => {
    const { text, date } = req.body;
    const id = req.params.id;
    const user = req.user.id;
    if (text && user && date) {
      db.query(
        'INSERT INTO comments (id_chapter, text, id_user, date) VALUES (?, ?, ?, ?)',
        [id, text, user, date],
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

//comments number
router.get('/comments/count/:id', (req, res) => {
    chapterId = req.params.id;
    const query = 'SELECT COUNT(*) as count FROM comments WHERE id_chapter = ?';
    db.query(query, [chapterId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const commentCount = results[0].count;
      res.json({ count: commentCount });
    });
  });
  module.exports = router