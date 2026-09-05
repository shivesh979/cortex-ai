import { initializeApp, cert } from "firebase-admin/app";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  const filePath = path.join(__dirname, "..", "serviceAccount.json");
  serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export const app = initializeApp({
  credential: cert(serviceAccount),
});
