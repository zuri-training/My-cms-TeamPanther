//This is an email handler function...
const nodemailer = require("nodemailer"); //--> This module will handle the auto email sending functionality by node
require("dotenv").config();

//create the function
const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: `${process.env.EMAIL_HOST}`,
    port: `${process.env.EMAIL_PORT}`,
    secure: false,
    logger: true,
    auth: {
      user: `${process.env.EMAIL_USERNAME}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
    tls: {
      rejectUnauthorized: false,
    },
    //Activate in Gmail, the less secure app option if you wanto use Gmail smtp
  });

  //2. Define the email options
  let mailOptions = {
    from: `Precious Blessed <tobechukwublessed30@yahoo.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<h1>Hello, World!</h1>`,
  };

  //Send the email with node mailer
  await transporter.sendMail(
    mailOptions //(err, info) => {
    //     if (err) {
    //       return console.log(`There was an Error: \n${err}`);
    //     } else console.log(`MailSent Successfully: ${info}`);
    //   })
  );
};

module.exports = sendEmail;
