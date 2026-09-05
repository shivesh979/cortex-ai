// Local-storage replacement for S3 presigned URLs. Returns a URL served by the
// API Gateway's static /uploads route. Keeps the original (fileName, expiresIn)
// signature; expiresIn is ignored since local files are not time-limited.
const GATEWAY_URL =
  process.env.GATEWAY_URL || "http://localhost:8000";

export const getDownloadUrl = async (
  fileName,
  expiresIn = 600
) => {
  return `${GATEWAY_URL.replace(/\/$/, "")}/uploads/${encodeURIComponent(fileName)}`;
};
