const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const userRoutes = require("./routes/userRoutes");
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes'); 
const likeRoutes = require('./routes/likeRoutes');       

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/comments", commentRoutes); 
app.use("/api/v1/likes", likeRoutes);       

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(
      `Server Running on ${process.env.DEV_MODE} mode port no ${PORT}`
    );
});
