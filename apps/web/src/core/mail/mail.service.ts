import "server-only";
import { mailSchema } from "./mail.schema";
import { createTransport } from "nodemailer";

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
if (!user || !pass) {
  throw new Error("Mailer ENVs required");
}

const transporter = createTransport({
  service: "gmail",
  auth: { user, pass },
});

export class MailService {
  static async send(data: SendMail) {
    mailSchema.parse(data);

    const fullText = `${data.text.trim()}\n\nBest Regards,\nThe MetaPress`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.to,
      subject: data.subject,
      text: fullText,
    });
  }
}
