const express = require('express');
const router = express.Router();
const createConnection = require('../db');
const db = createConnection();


//get product details
router.post("/contact",(req, res) => {
    const { nom, prenom, email, mobile, message } = req.body;
  
    const query = 'INSERT INTO contact (nom, prenom, email, mobile, message) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nom, prenom, email, mobile, message], (err, res) => {
      if(err){
        console.log("error")
    }else{
        console.log("data added")
    }
    });
   
  });

 

  module.exports = router