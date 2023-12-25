import nodemailer from "nodemailer";
import "dotenv/config";

const { EMAIL, EMAIL_PASSWORD } = process.env;

const config = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASSWORD,
  },
};

const transport = nodemailer.createTransport(config);

const emailSend = (data) => {
  const email = { ...data, from: "shyra117@ukr.net" };
  return transport.sendMail(email);
};

export default emailSend;
