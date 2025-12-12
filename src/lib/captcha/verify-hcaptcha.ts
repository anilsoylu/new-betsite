import { env } from "@/lib/env";
import { AppError } from "@/lib/errors";

interface HCaptchaVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  credit?: boolean;
  "error-codes"?: Array<string>;
}

/**
 * Verifies an hCaptcha token server-side
 * @param token - The hCaptcha response token from the client
 * @returns true if verification successful
 * @throws AppError if verification fails or secret is not configured
 */
export async function verifyHCaptcha(token: string): Promise<boolean> {
  const secret = env.HCAPTCHA_SECRET_KEY;

  if (!secret) {
    throw new AppError(
      "hCaptcha secret key not configured",
      "CAPTCHA_CONFIG_ERROR",
      500,
    );
  }

  const response = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret,
      response: token,
    }),
  });

  if (!response.ok) {
    throw new AppError(
      "hCaptcha verification service unavailable",
      "CAPTCHA_SERVICE_ERROR",
      503,
    );
  }

  const data: HCaptchaVerifyResponse = await response.json();
  return data.success === true;
}
