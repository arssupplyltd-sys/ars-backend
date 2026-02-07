const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET","POST"]
  }));
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: "mail.arssupply.co.uk",
    port: 465,
    secure: true,
    auth: {
      user: "sales@arssupply.co.uk",
      pass: process.env.SMTP_PASS,
    },
  });
  

app.get('/contact', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Contact API is working',
    });
  });
  
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_USER}>`,
      to: "sales@arssupply.co.uk",
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
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
