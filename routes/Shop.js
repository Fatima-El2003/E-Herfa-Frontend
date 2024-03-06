const express = require('express');
const router = express.Router();
const createConnection = require('../db');

router.get("/",(req,res)=>{
    const db = createConnection();
    try {
        db.query("SELECT * FROM product",(err,result)=>{
            if(err){
                console.error("error",err)
            }else{
                console.log("data get")
                res.status(201).json({status:201,data:result})
            }
            db.end();
        })
    } catch (error) {
        res.status(422).json({status:422,error})
    }
  });
 module.exports = router
