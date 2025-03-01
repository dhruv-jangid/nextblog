"use server";

import sgMail from "@sendgrid/mail";

export const sendEmail = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) => {
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_EMAIL_FROM) {
    throw new Error("ENV is not set");
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const message = {
    to: to.toLowerCase().trim(),
    from: process.env.SENDGRID_EMAIL_FROM,
    subject: subject.trim(),
    text: text.trim(),
  };

  try {
    const [response] = await sgMail.send(message);

    if (response.statusCode !== 202) {
      throw new Error(
        `SendGrid API returned status code ${response.statusCode}`
      );
    }

    return { success: true, messageId: response.headers["x-message-id"] };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Failed to send email. Please try again later!",
    };
  }
};
