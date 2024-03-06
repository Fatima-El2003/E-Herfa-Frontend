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

  //get chapters
router.get("/getchapters/:id", (req, res) => {
    try {
      const courseId = req.params.id;
      db.query(
        "SELECT * FROM chapters WHERE id_course = ?",
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
        res.status(422).json({ status: 422, error });
      }
    });
router.get("/getchaptersbyid/:id", (req, res) => {
  
    try {
      const courseId = req.params.id; 
  
      db.query("SELECT * FROM chapters WHERE id_course = ?", courseId, (err, result) => {
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

router.get("/getchaptersbyidchapte/:id", (req, res) => {
  
    try {
      const chapterId = req.params.id; 
  
      db.query("SELECT * FROM chapters WHERE id = ?", chapterId, (err, result) => {
        if(err){
          console.log("error")
      }else{
          console.log("data get")
          res.status(201).json({status:201,data:result})
      }
  })
  } catch (error) {
      res.status(422).json({ status: 422, error });
    }
  });

  module.exports = router