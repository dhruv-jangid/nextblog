import "server-only";
import { ZodError } from "zod";
import { createTransport } from "nodemailer";
import { emailSchema } from "../schemas/auth";
import { getFirstZodError } from "../schemas/other";

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
if (!user || !pass) {
  throw new Error("Mailer ENVs required");
}

const transporter = createTransport({
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
    emailSchema.parse(to);

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
