import "server-only";

export const changeEmailVerificationText = ({
  name,
  newEmail,
  url,
}: {
  name: string;
  newEmail: string;
  url: string;
}): string => {
  return `Hi ${name},

We received a request to change the primary email address on your MetaPress account to: ${newEmail}

If you made this change, please verify your new email address by clicking the link below:

${url}

⚠️ This link will expire in 1 hour.

If you did NOT request this change, please ignore this email. No action will be taken.

For your security, do not share this email or the verification link with anyone.`;
};

export const deleteAccountVerificationText = ({
  name,
  url,
}: {
  name: string;
  url: string;
}): string => {
  return `Hey ${name},

We received a request to permanently delete your MetaPress account.

If you made this request, please confirm by clicking the link below:

${url}

⚠️ This link will expire in 1 hour. Once your account is deleted, all associated data will be permanently erased and cannot be recovered.

If you did NOT request this, please ignore this email. No further action is needed.

For your security, do not share this email or the confirmation link with anyone.`;
};

export const resetPasswordText = ({
  name,
  url,
}: {
  name: string;
  url: string;
}): string => {
  return `Hey ${name},

We received a request to reset the password for your MetaPress account.

If you made this request, you can reset your password by clicking the link below:

${url}

⚠️ This link will expire in 1 hour and can only be used once.

If you did NOT request a password reset, please ignore this email. Your account will remain secure.

For your security, do not share this email or the reset link with anyone.`;
};

export const verificationEmailText = ({
  name,
  url,
}: {
  name: string;
  url: string;
}): string => {
  return `Hey ${name},

Welcome to MetaPress! Please verify your email address to activate your account.

Click the link below to complete your signup:

${url}

⚠️ This link will expire in 1 hour.

If you did NOT create an account with MetaPress, please ignore this email.

For your security, do not share this email or the verification link with anyone.`;
};

export const contactMessage = ({
  name,
  subject,
  message,
}: {
  name: string;
  subject: string;
  message: string;
}): string => {
  return `Hi ${name},

Thanks for reaching out to us. Here’s a copy of your message:

Subject: ${subject}
Message: ${message}

We’ve received your inquiry and will get back to you shortly.`;
};
