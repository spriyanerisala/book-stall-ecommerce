import nodemailer from "nodemailer";

export const ordersEmail = async (fromEmail, fromPass, to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: fromEmail, pass: fromPass },
  });

  await transporter.sendMail({ from: fromEmail, to, subject, text });
};