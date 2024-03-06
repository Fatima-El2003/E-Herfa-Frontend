const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require("multer");
const cookieParser = require("cookie-parser")
const app = express();

const secretKey = 'your-secret-key'; 
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use("/uploads",express.static("./uploads"))
 

const achievementRoute = require('./routes/Achievement');
const shopRoute = require('./routes/Shop');
const authRoute = require('./routes/Authen');
const productRoute = require('./routes/product');
const courseRoute = require('./routes/course');
const chapterRoute = require('./routes/chapter');
const contactRoute = require('./routes/contact');
const profileRoute = require('./routes/profile');
const progressRoute = require('./routes/progress');
const commentRoute = require('./routes/comment');
const likeRoute = require('./routes/like');
const favoriteRoute = require('./routes/favorite');
app.use("/Achievement", achievementRoute);
app.use("/getdata", shopRoute);
app.use("/Authen", authRoute);
app.use("/product", productRoute);
app.use("/course", courseRoute);
app.use("/chapter", chapterRoute);
app.use("/contact", contactRoute);
app.use("/profile", profileRoute);
app.use("/progress", progressRoute);
app.use("/comment", commentRoute);
app.use("/like", likeRoute);
app.use("/favorite", favoriteRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

