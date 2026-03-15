export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const MIN_PAGE_SIZE = 1;
export const MAX_PAGE_SIZE = 100;

// Upload image limit is 20MB
export const IMAGE_SIZE_LIMIT = 50 * 1024 * 1024;

// Upload default folder
export const DEFAULT_PHOTOS_UPLOAD_FOLDER = "photos";

// WhatsApp contact number — set NEXT_PUBLIC_WHATSAPP_NUMBER in .env (international format, no +)
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
