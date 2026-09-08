import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let app;

try {
  let serviceAccount;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    const filePath = path.join(__dirname, "..", "serviceAccount.json");
    if (fs.existsSync(filePath)) {
      serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  }

  if (serviceAccount) {
    app = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // Fallback: use application default credentials (GOOGLE_APPLICATION_CREDENTIALS env)
    app = initializeApp();
  }
} catch (err) {
  console.warn("[firebase] Firebase init failed:", err.message);
  console.warn("[firebase] Firebase-dependent features (login) will not work until configured.");
  app = null;
}

export { app };
