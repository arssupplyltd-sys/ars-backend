const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

app.use(express.json());

/**
 * Gmail SMTP transporter
 * IMPORTANT:
 * - Use Gmail address
 * - Use Gmail APP PASSWORD (not normal password)
 */
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });

app.get("/contact", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Contact API is working",
  });
});

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"Website Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // mail will come to your gmail
      subject: "New Contact Form Message",
      html: `
        <h3>New enquiry from website</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.log("MAIL ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
  
});

app.listen(5000, () => console.log("Server running on port 5000"));
