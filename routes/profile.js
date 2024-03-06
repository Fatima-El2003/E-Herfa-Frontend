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

//get profile
router.get("/getuserdata", validateToken, (req, res) => {
  
    const id = req.user.id; 
console.log(id);
    db.query("SELECT * FROM users WHERE id_user = ?", id, (err, result) => {
      if(err){
        console.log("error")
    }else{
        console.log("data get")
        res.status(201).json({status:201,data:result})
    }
})

});

//add profile
router.post('/addprofile', validateToken, upload.single("photo"),(req, response) => {
  const id = req.user.id;
  const { name, email, bio } = req.body;
  const filename = req.file.filename;

  const query =  `
  UPDATE users
  SET
    username = ?,
    email = ?,
    image = ?,
    bio = ?
  WHERE
    id_user = ?
`;
db.query(query, [name, email, filename, bio, id], (err, res) => {
    if (err) {
      console.error("Error updating profile:", err);
      response.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Profile data updated successfully");
      response.status(201).json({ status: 201, message: "Profile data updated successfully" });
    }
  });
 
});

  module.exports = router