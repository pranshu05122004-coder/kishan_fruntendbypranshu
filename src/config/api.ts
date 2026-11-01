const LOCAL_API_URL = "http://localhost:5001";

const LIVE_API_URL =
  "https://navajowhite-wolverine-803334.hostingersite.com";

export const API_URL = import.meta.env.DEV
  ? LOCAL_API_URL
  : LIVE_API_URL;

export const API_BASE = `${API_URL}/api`;
