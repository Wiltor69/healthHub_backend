import nodemailer from "nodemailer";
import "dotenv/config";

const { MAILTRAP_USER, MAILTRAP_PASSWORD } = process.env;

const config = {
  host: "sandbox.smtp.mailtrap.io",
  port: 465,

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
