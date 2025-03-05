const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const nodemailer = require("nodemailer");
const adminRoutes = require('./routes/adminRoutes');
const populateRewards = require("./scripts/populateReward");
const multer = require("multer");

dotenv.config();

const userRoutes = require("./routes/userRoutes");
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes'); 
const likeRoutes = require('./routes/likeRoutes');       
const path = require('path');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/uploads", express.static("uploads"));

let subscribers = [];

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateNewsletter = () => `
  <h1>✨ Welcome to Our Weekly Newsletter</h1>
  <h2>📝 Featured Blog</h2>
  <p><a href="https://yourblog.com/post-1">Mastering Responsive Design in 2025</a></p>
  <p>Learn the essentials of building adaptable websites for any device.</p>
  <h3>Thanks for joining us!</h3>
`;

app.post("/api/v1/newsletter/subscribe", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  subscribers.push(email);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to Our Newsletter!",
    html: generateNewsletter(),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ success: false, message: "Failed to send email." });
    }

    res.status(200).json({ success: true, message: "Subscribed successfully!" });
  });
});

app.post("/api/v1/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, 
    subject: `New Contact Form Submission from ${name}`,
    text: `You received a new message from:
    
    Name: ${name}
    Email: ${email}
    Message: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ success: false, message: "Failed to send email." });
    }

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  });
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/comments", commentRoutes); 
app.use("/api/v1/likes", likeRoutes); 
app.use("/api/v1/comments", commentRoutes); 
app.use("/api/v1/admin", adminRoutes);
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(
      `Server Running on ${process.env.DEV_MODE} mode port no ${PORT}`
    );
});