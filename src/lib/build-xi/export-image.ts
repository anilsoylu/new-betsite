import { toPng, toJpeg } from "html-to-image";

export interface ExportOptions {
  format?: "png" | "jpeg";
  quality?: number;
  pixelRatio?: number;
  backgroundColor?: string;
}

/**
 * Export an HTML element as an image blob
 */
export async function exportElementAsImage(
  element: HTMLElement,
  options: ExportOptions = {},
): Promise<Blob> {
  const {
    format = "png",
    quality = 0.95,
    pixelRatio = 2, // High DPI for better quality
    backgroundColor,
  } = options;

  const exportFn = format === "jpeg" ? toJpeg : toPng;

  const dataUrl = await exportFn(element, {
    quality,
    pixelRatio,
    backgroundColor,
    cacheBust: true, // Prevent caching issues with images
    fetchRequestInit: {
      mode: "cors",
    },
  });

  // Convert data URL to Blob
  const response = await fetch(dataUrl);
  return response.blob();
}

/**
 * Export an element by ID as an image
 */
export async function exportElementById(
  elementId: string,
  options: ExportOptions = {},
): Promise<Blob> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }
  return exportElementAsImage(element, options);
}

/**
 * Download an element as an image file
 */
export async function downloadElementAsImage(
  elementId: string,
  fileName: string,
  options: ExportOptions = {},
): Promise<void> {
  const blob = await exportElementById(elementId, options);
  const format = options.format || "png";

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.${format}`;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export the lineup pitch as an image
 */
export async function exportLineupImage(
  lineupName: string = "lineup",
): Promise<void> {
  const sanitizedName = lineupName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const fileName = sanitizedName || "my-lineup";

  return downloadElementAsImage("pitch-export", fileName, {
    format: "png",
    pixelRatio: 2,
  });
}
