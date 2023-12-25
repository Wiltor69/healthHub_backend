import nodemailer from "nodemailer";
import "dotenv/config";

const { EMAIL, MAILTRAP_USER, MAILTRAP_PASSWORD } = process.env;

const config = {
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,

  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASSWORD,
  },
};

const transport = nodemailer.createTransport(config);

const emailSend = (data) => {
  const email = { ...data, from: EMAIL };
  return transport.sendMail(email);
};

export default emailSend;
