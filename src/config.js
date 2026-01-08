// Use empty string for relative paths in production (Monolith architecture)
// or fallback to localhost for local development if env var is missing
export const API_BASE_URL = import.meta.env.VITE_API_URL || "";
export const IMAGE_BASE_URL = import.meta.env.VITE_API_URL || "";
