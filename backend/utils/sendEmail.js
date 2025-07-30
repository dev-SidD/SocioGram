const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // smtp.gmail.com
      port: parseInt(process.env.EMAIL_PORT), // 465 for SSL
      secure: true, // Use true for port 465, false for 587
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // your Gmail App Password
      },
    });

    await transporter.sendMail({
      from: `"Sociogram Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    throw err;
  }
};

module.exports = sendEmail;
