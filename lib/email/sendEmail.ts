import "server-only";
import { ZodError } from "zod";
import nodemailer from "nodemailer";
import { emailValidator, getFirstZodError } from "@/lib/schemas/shared";

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
if (!user || !pass) {
  throw new Error("Mailer ENVs required");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user, pass },
});

export const sendEmail = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> => {
  try {
    emailValidator.parse(to);

    const fullText = `${text.trim()}\n\nBest Regards,\nThe MetaPress`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: fullText,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};
