/**
 * Browser Fingerprint Utility for Vote Rate Limiting
 *
 * Creates a simple browser fingerprint to help identify users across sessions.
 * This is not meant to be a perfect fingerprint (those can be bypassed too),
 * but adds another layer of protection against casual vote manipulation.
 *
 * Components:
 * - Canvas fingerprint (GPU rendering differences)
 * - Screen resolution
 * - Timezone offset
 * - Language
 * - Platform
 */

/**
 * Generate a simple hash from a string
 * Uses a basic djb2 algorithm - fast and good enough for fingerprinting
 */
function simpleHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  // Convert to hex and take last 8 chars
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * Get canvas fingerprint
 * Different GPUs/drivers render text slightly differently
 */
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "no-canvas";

    // Draw some text with specific styling
    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("Vote Fingerprint", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("Vote Fingerprint", 4, 17);

    // Get data URL and hash it
    const dataUrl = canvas.toDataURL();
    return simpleHash(dataUrl);
  } catch {
    return "canvas-error";
  }
}

/**
 * Get WebGL fingerprint (renderer info)
 */
function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "no-webgl";

    const webgl = gl as WebGLRenderingContext;
    const debugInfo = webgl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return "no-debug-info";

    const vendor = webgl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "";
    const renderer = webgl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";

    return simpleHash(`${vendor}|${renderer}`);
  } catch {
    return "webgl-error";
  }
}

/**
 * Generate the complete browser fingerprint
 * Returns a base64-encoded string that can be sent as a header
 */
export function generateFingerprint(): string {
  // Collect fingerprint components
  const components = [
    getCanvasFingerprint(),
    getWebGLFingerprint(),
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    new Date().getTimezoneOffset().toString(),
    navigator.language || "unknown",
    navigator.platform || "unknown",
    navigator.hardwareConcurrency?.toString() || "unknown",
    // @ts-expect-error - deviceMemory is not in all browsers
    navigator.deviceMemory?.toString() || "unknown",
  ];

  // Join and encode
  const fingerprint = components.join("|");
  return btoa(fingerprint);
}

/**
 * Get fingerprint with caching
 * Fingerprint is cached in sessionStorage to avoid recalculating
 */
let cachedFingerprint: string | null = null;

export function getFingerprint(): string {
  if (cachedFingerprint) {
    return cachedFingerprint;
  }

  // Try to get from sessionStorage first
  if (typeof window !== "undefined" && window.sessionStorage) {
    const stored = sessionStorage.getItem("vote_fp");
    if (stored) {
      cachedFingerprint = stored;
      return stored;
    }
  }

  // Generate new fingerprint
  cachedFingerprint = generateFingerprint();

  // Cache in sessionStorage
  if (typeof window !== "undefined" && window.sessionStorage) {
    try {
      sessionStorage.setItem("vote_fp", cachedFingerprint);
    } catch {
      // sessionStorage might be full or disabled
    }
  }

  return cachedFingerprint;
}

/**
 * Decode fingerprint for server-side analysis
 * Returns the raw components for logging/debugging
 */
export function decodeFingerprint(
  encoded: string,
): Record<string, string> | null {
  try {
    const decoded = atob(encoded);
    const parts = decoded.split("|");

    return {
      canvas: parts[0] || "unknown",
      webgl: parts[1] || "unknown",
      screen: parts[2] || "unknown",
      timezone: parts[3] || "unknown",
      language: parts[4] || "unknown",
      platform: parts[5] || "unknown",
      cores: parts[6] || "unknown",
      memory: parts[7] || "unknown",
    };
  } catch {
    return null;
  }
}
