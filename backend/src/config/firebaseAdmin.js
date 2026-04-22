import { initializeApp, cert, getApp, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import fs from "node:fs";

function getFirebaseCredential() {
  // Recommended for Render/Vercel/etc: store the full service account JSON in an env var.
  // Example env var name:
  // FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
  const fromEnvJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (fromEnvJson) {
    return cert(JSON.parse(fromEnvJson));
  }

  // Optional: point to a service account file path via env var.
  // Useful if your platform provides "secret files".
  const fromEnvPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (fromEnvPath) {
    const json = fs.readFileSync(fromEnvPath, "utf8");
    return cert(JSON.parse(json));
  }

  // Local dev fallback: keep using your repo-local file.
  const localPath = new URL("../../.secret", import.meta.url);
  const json = fs.readFileSync(localPath, "utf8");
  return cert(JSON.parse(json));
}

const storageBucket =
  process.env.FIREBASE_STORAGE_BUCKET ?? "bill-breeze-54906.firebasestorage.app";

const app = getApps().length
  ? getApp()
  : initializeApp({ credential: getFirebaseCredential(), storageBucket });

console.log("getApps().length:", getApps().length);

export const bucket = getStorage(app).bucket();

export default app;