import { NextResponse } from "next/server";
import { verifyHCaptcha } from "@/lib/captcha/verify-hcaptcha";
import { sendContactEmail } from "@/lib/email/send-contact-email";
import { AppError, createErrorResponse, logError } from "@/lib/errors";
import { contactFormSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactFormSchema.parse(body);

    // Verify hCaptcha token
    const captchaValid = await verifyHCaptcha(validated.captchaToken);
    if (!captchaValid) {
      throw new AppError(
        "Captcha verification failed",
        "CAPTCHA_INVALID",
        400,
      );
    }

    // Send contact email
    await sendContactEmail({
      name: validated.name,
      surname: validated.surname,
      company: validated.company || undefined,
      email: validated.email,
      subject: validated.subject,
      message: validated.message,
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully",
    });
  } catch (error) {
    logError("api/contact", error);
    const { body, status } = createErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
