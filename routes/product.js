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
router.post('/addproduct', validateToken, upload.single('photo'), (req, res) => {
    const { name, quantity, price, category, description } = req.body;
    const { filename } = req.file;
    const id = req.user.id
    const query = 'INSERT INTO product ( id_seller, name, quantity, price, category, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [id, name, quantity, price, category, description, filename], (err, result) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
      } else {
        console.log('Data added successfully');
        res.status(201).json({ status: 201, message: 'Data added successfully' });
      }
    });
  });

router.delete("/delete/:id", (req,res) => {
    const id = req.params.id;
    db.query("DELETE FROM product WHERE id = ?", id, (err,result) => {
      if(err){
        console.log(err);
      } else {
        res.send(result);
      }
    })
  })
router.get("/getuserproduct", validateToken, (req,res)=>{
  const id = req.user.id
    try {
        db.query("SELECT * FROM product WHERE id_seller = ?", id, (err,result)=>{
            if(err){
                console.error("error",err)
                res.status(500).json({ status: 500, error: "Error fetching data" });
            }else{
                console.log("data get")
                res.status(201).json({status:201,data:result})
            }
        })
    } catch (error) {
        res.status(302).json({status:302,error})
    }
  });

router.get("/getproductdetails/:id", (req, res) => {
  
    try {
      const productId = req.params.id; 
  
      db.query("SELECT * FROM product WHERE id = ?", productId, (err, result) => {
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

router.get('/products/count', validateToken, (req, res) => {
    const userId = req.user.id;
    const query = `SELECT COUNT(*) as count FROM product WHERE id_seller = ?`;
    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const productCount = results[0].count;
      res.json({ count: productCount });
    });
  });
 module.exports = router
