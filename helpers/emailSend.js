import nodemailer from "nodemailer";
import "dotenv/config";

const { EMAIL, EMAIL_PASSWORD } = process.env;

const config = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
};

const transport = nodemailer.createTransport(config);

const sendEmail = (data) => {
  const email = { ...data, from: EMAIL };
  return transport.sendMail(email);
};

export default sendEmail;
