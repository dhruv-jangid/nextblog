export {};

declare global {
  type SendMail = {
    to: string;
    subject: string;
    text: string;
  };
}
