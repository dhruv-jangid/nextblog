"use server";

export const handleContact = async (prevState, formData: FormData) => {
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  console.log({
    name,
    email,
    subject,
    message,
  });

  return "Message sent successfully";
};
