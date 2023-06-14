const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, sent_from) => {
  const transporter = nodemailer.createTransport({
    host: process.env.Email_Host,
    port: 587,
    auth: {
      user: process.env.Email_User,
      pass: process.env.Email_Pass,
    },
  });

  const options = {
    from: sent_from,
    to: send_to,
    subject: subject,
    html: message,
  };
  await transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log("err:", err);
    } else {
      console.log("info:", info);
    }
  });
};

module.exports = sendEmail;
