import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import { env } from "@/lib/env";
import { AppError, logError } from "@/lib/errors";
import { ContactEmailTemplate } from "./templates/contact-email";

interface SendContactEmailParams {
  name: string;
  surname: string;
  company?: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Sends a contact form email using Nodemailer
 * @param params - Contact form data
 * @throws AppError if email configuration is missing or sending fails
 */
export async function sendContactEmail(
  params: SendContactEmailParams,
): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_TO } = env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_TO) {
    throw new AppError(
      "Email configuration is incomplete",
      "EMAIL_CONFIG_ERROR",
      500,
    );
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    tls: {
      // Required: mail server doesn't support HTTPS
      rejectUnauthorized: false,
    },
  });

  const emailHtml = await render(ContactEmailTemplate(params));

  try {
    await transporter.sendMail({
      from: `"${params.name} ${params.surname}" <${SMTP_USER}>`,
      replyTo: params.email,
      to: SMTP_TO,
      subject: `[Contact] ${params.subject}`,
      html: emailHtml,
    });
  } catch (error) {
    logError("sendContactEmail", error);
    throw new AppError("Failed to send email", "EMAIL_SEND_ERROR", 500);
  }
}
