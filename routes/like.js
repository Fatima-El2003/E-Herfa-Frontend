const express = require('express');
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const createConnection = require('../db');
const db = createConnection();

//likes
router.post('/likes/:id', (req, res) => {
    // Assuming you have a video ID to associate the like with
    const chapterId = req.params.id;// Replace with the actual video ID
  
    // Insert a new like into your 'likes' table
    db.query('INSERT INTO likes (id_chapter) VALUES (?)', [chapterId], (err, result) => {
      if (err) {
        console.error('Error liking video:', err);
        res.status(500).json({ error: 'Error liking video' });
      } else {
        res.status(200).json({ message: 'Video liked successfully' });
      }
    });
  });
router.get('/likes/:id', (req, res) => {
    // Assuming you have a video ID to retrieve the likes count for
    const chapterId = req.params.id;
  
    // Query the database to get the likes count for the specific video
    db.query('SELECT COUNT(*) AS likes FROM likes WHERE id_chapter = ?', [chapterId], (err, result) => {
      if (err) {
        console.error('Error fetching likes:', err);
        res.status(500).json({ error: 'Error fetching likes' });
      } else {
        // Return the likes count as JSON
        res.status(200).json({ likes: result[0].likes });
      }
    });
  });
  module.exports = router