import nodemailer from "nodemailer";
import { env } from "../../../env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

type SendMailParams = {
  to: string;
  subject: string;
  html: string;
};

const sendMail = async ({
  to,
  subject,
  html,
}: SendMailParams): Promise<void> => {
  await transporter.sendMail({
    from: env.SMTP_FROM_EMAIL,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const verificationLink = `${env.CLIENT_URL}/verify-email?token=${token}`;

  const html = `
    <h2>Verify Your Email</h2>
    <p>Click the link below to verify your email:</p>
    <a href="${verificationLink}">${verificationLink}</a>
  `;

  await sendMail({
    to: email,
    subject: "Verify Your Email",
    html,
  });
};

export { sendMail, sendVerificationEmail };