const LOCAL_API_URL = "http://localhost:5001";

const LIVE_API_URL =
  "https://navajowhite-wolverine-803334.hostingersite.com";

export const API_URL = import.meta.env.DEV
  ? LOCAL_API_URL
  : LIVE_API_URL;

export const API_BASE = `${API_URL}/api`;

// PDF files are stored on the admin backend
export const PDF_BASE_URL =
  "https://lightslategray-goldfinch-606464.hostingersite.com/customer-pdfs";

export const getPdfUrl = (
  pdfPath?: string | null
): string | null => {
  if (!pdfPath || !pdfPath.trim()) return null;

  const value = pdfPath.trim();

  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      const parsed = new URL(value);

      if (
        parsed.hostname !== "navajowhite-wolverine-803334.hostingersite.com" &&
        parsed.hostname !== "lightslategray-goldfinch-606464.hostingersite.com"
      ) {
        return value;
      }

      const filename = parsed.pathname.split("/").pop();

      return filename
        ? `${PDF_BASE_URL}/${encodeURIComponent(decodeURIComponent(filename))}`
        : null;
    } catch {
      return null;
    }
  }

  const cleanPath = value.split("?")[0].split("#")[0];
  const filename = cleanPath.split("/").pop();

  return filename
    ? `${PDF_BASE_URL}/${encodeURIComponent(filename)}`
    : null;
};
