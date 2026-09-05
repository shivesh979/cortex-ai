import fs from "fs/promises";
import path from "path";

// Local-storage replacement for S3 upload. Files are written to the shared
// `uploads/` directory (relative to the backend cwd) which the API Gateway
// serves statically at /uploads. Keeps the original (buffer, fileName,
// contentType) signature so agent code needs no changes.
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

export const uploadToS3 = async (
  buffer,
  fileName,
  contentType
) => {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, fileName), buffer);
  return fileName;
};
