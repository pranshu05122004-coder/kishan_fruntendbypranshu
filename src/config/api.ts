
const LOCAL_API_URL = "http://localhost:5001";

const LIVE_API_URL =
  "https://navajowhite-wolverine-803334.hostingersite.com";

export const API_URL = import.meta.env.DEV
  ? LOCAL_API_URL
  : LIVE_API_URL;

export const API_BASE = `${API_URL}/api`;

export const PDF_BASE_URL =
  "https://lightslategray-goldfinch-606464.hostingersite.com/customer-pdfs";

export const getPdfUrl = (
  pdfPath?: string | null
): string | null => {
  if (!pdfPath || !pdfPath.trim()) return null;

  const value = pdfPath.trim();

  try {
    const parsed = new URL(value, LOCAL_API_URL);
    const filename = decodeURIComponent(
      parsed.pathname.split("/").pop() || ""
    );

    if (!filename) return null;

    const encodedFilename = encodeURIComponent(filename);

    // Local testing: use local backend PDF route
    if (import.meta.env.DEV) {
      return `${LOCAL_API_URL}/pdf/${encodedFilename}`;
    }

    // Live: use admin PDF server
    if (
      parsed.hostname === "navajowhite-wolverine-803334.hostingersite.com" ||
      parsed.hostname === "lightslategray-goldfinch-606464.hostingersite.com" ||
      !value.startsWith("http")
    ) {
      return `${PDF_BASE_URL}/${encodedFilename}`;
    }

    return value;
  } catch {
    return null;
  }
};
